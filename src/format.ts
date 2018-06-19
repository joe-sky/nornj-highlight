class Char {
  public stream: string;
  public pos: number;
  constructor(stream: string, pos: number) {
    this.stream = stream;
    this.pos = pos;
  }
  get value() {
    return this.stream[this.pos];
  }
}

class Token {
  public stream: string;
  public start: number;
  public end: number;
  constructor(stream: string, start: number, end: number) {
    this.stream = stream;
    this.start = start;
    this.end = end;
  }
  get value() {
    return this.stream.slice(this.start, this.end);
  }
  get whitespace() {
    let i = this.start - 1;
    for (; i >= 0 && /\s/.test(this.stream[i]); i--)
      ;
    return new Token(this.stream, i + 1, this.start);
  }
}

function nextChar(s: string, i: number, regex = /\S/g) {
  if (!regex.global)
    throw new Error('Regexp must be global');
  regex.lastIndex = i;
  const res = regex.exec(s);
  if (!res)
    return;
  return new Char(s, res.index);
}

function nextToken(s: string, i: number) {
  let char = nextChar(s, i);
  if (!char)
    return;
  const start = char.pos;
  char = nextChar(s, start + 1, /[\s<]|>/g);
  const end = char ? char.pos + Number(char.value == '>') : s.length;
  return new Token(s, start, end);
}

const voidTags = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
  '!doctype',
  //'!--'
];

const REGEX_COMMENT = /^!--/;
const REGEX_COMMENT_END = /-->$/;

function parseTokenValue(value: string) {
  const tagName = value.replace(/^<\/?|>$/g, '').toLowerCase();

  const isTagStart = /</.test(value);
  const isTagEnd = />/.test(value);

  const isStartTag = /<([^/]|$)/.test(value);
  const isEndTag = /<\//.test(value) || (
    isStartTag && (voidTags.indexOf(tagName) != -1 || REGEX_COMMENT.test(tagName))
  );
  const isSelfCloseTagEnd = /\/>$/.test(value) || REGEX_COMMENT_END.test(value);

  return {
    isTagStart, isTagEnd, isStartTag, isEndTag, tagName, isSelfCloseTagEnd
  };
}

type LookUp = {
  [key: string]: string
};
const LT_GT_LOOKUP: LookUp = {
  '<': '_njLt_',
  '>': '_njGt_',
  '=': '_njEq_'
};
const LT_GT_LOOKUP_R: LookUp = {
  '_njLt_': '<',
  '_njGt_': '>',
  '_njEq_': '='
};

const REGEX_LT_GT = />|<|=/g;
const REGEX_MUSTACHE = /(([\s]+:[^\s=>]+=)(('[^']+')|("[^"]+")))|({{{?[\s\S]+?}}}?|{{?[\s\S]+?}}?)/g;
const REGEX_LT_GT_R = /_nj(Lt|Gt|Eq)_/g;
const REGEX_LT_GT_S = /(<[\s]*(textarea|pre|script|style)[^>]*>)([\s\S]*?)(<\/\2>)/ig;
const REGEX_LT_GT_C = /(<!--)([\s\S]*?)(-->)/g;
const REGEX_QUOTE = /"[^"]*"|'[^']*'/g;
const REGEX_QUOTE_D = /"[^"]*"/g;
const REGEX_QUOTE_S = /'[^']*'/g;
const REGEX_REPLACE_CHAR = /_njQs(\d+)_/g;

function format(html: string, indent = '  '/*, width = 80*/) {
  const output = [];
  const innerQuotes: string[] = [];

  html = html.replace(REGEX_MUSTACHE, (all, g1, g2, g3, g4, g5, g6) => {
    if (g1) {
      return g2 + g3.replace(g4 ? REGEX_QUOTE_D : REGEX_QUOTE_S, (match: string) => {
        innerQuotes.push(match);
        return '_njQs' + (innerQuotes.length - 1) + '_';
      }).replace(REGEX_LT_GT, (match: string) => LT_GT_LOOKUP[match])
    }
    else {
      return g6.replace(REGEX_QUOTE, (match: string) => {
        innerQuotes.push(match);
        return '_njQs' + (innerQuotes.length - 1) + '_';
      }).replace(REGEX_LT_GT, (match: string) => LT_GT_LOOKUP[match]);
    }
  });
  html = html.replace(REGEX_LT_GT_S, (all, g1, g2, g3, g4) => {
    return g1 + g3.replace(REGEX_LT_GT, (match: string) => LT_GT_LOOKUP[match]) + g4;
  });
  html = html.replace(REGEX_LT_GT_C, (all, g1, g2, g3) => {
    return g1 + g2.replace(REGEX_LT_GT, (match: string) => LT_GT_LOOKUP[match]) + g3;
  });

  let inStartTag = false;
  let inEndTag = false;
  let inSpecialElement = false;
  let isStartTagSpecial = false;
  let indentLevel = 0;

  let prevState: any = {};
  let token: Token | undefined;
  let i = 0;

  while (token = nextToken(html, i)) {
    let tokenValue = token.value;
    let tokenWhitespaceValue = token.whitespace.value;
    let pendingWhitespace = '';
    let { isTagStart, isTagEnd, isStartTag, isEndTag, tagName, isSelfCloseTagEnd } =
      parseTokenValue(tokenValue);

    // Token adjustments for edge cases
    // Remove space before tag name
    if (isTagStart && !tagName) {
      i = token.end;
      token = nextToken(html, i);
      if (!token)
        break;
      tokenValue += token.value;
      ({ isTagStart, isTagEnd, isStartTag, isEndTag, tagName, isSelfCloseTagEnd } =
        parseTokenValue(tokenValue));
    }
    // Split attributes stuck together
    if (!isTagStart && (inStartTag || inEndTag)) {
      // If attribute has end quote followed by another attribute
      const regex = /[^=]"[^>]/g;
      const res = regex.exec(tokenValue);
      if (res && token.end != token.start + res.index + 2) {
        token.end = token.start + res.index + 2;
        tokenValue = token.value;
        ({ isTagStart, isTagEnd, isStartTag, isEndTag, tagName, isSelfCloseTagEnd } =
          parseTokenValue(tokenValue));
        pendingWhitespace = indent;
      }
    }

    // Current State
    if (isStartTag)
      inStartTag = true;
    if (isEndTag)
      inEndTag = true;
    if (isEndTag && !isStartTag && !inSpecialElement) // A void tag will be both
      --indentLevel;

    const isCommentStart = REGEX_COMMENT.test(tagName);
    const isCommentEnd = REGEX_COMMENT_END.test(tokenValue);
    if ((isTagStart && (['textarea', 'pre', 'script', 'style'].indexOf(tagName) != -1 || (isCommentStart && !isCommentEnd)))
      || (isTagEnd && isCommentEnd && !isCommentStart)) {
      inSpecialElement = !inSpecialElement;
      if (inSpecialElement) {
        isStartTagSpecial = true;
      }
    }

    // Convenience
    const inTag = inStartTag || inEndTag;

    // Whitespace
    const whitespace = tokenWhitespaceValue || prevState.pendingWhitespace;
    const ignoreSpace = (inTag && (
      /^[=">]/.test(tokenValue) || /(^|=)"$/.test(prevState.tokenValue)
    )) || i == 0;
    if (inSpecialElement && !inTag)
      output.push(tokenWhitespaceValue);
    else if (whitespace && !ignoreSpace) {
      const numNewlines = (whitespace.match(/\n/g) || []).length;

      // const lastNewline = output.lastIndexOf('\n');
      // const lineLength = output.slice(lastNewline).reduce(
      //   (l, s) => l + s.length, 0
      // );

      const indents = indentLevel > 0 ? indent.repeat(
        indentLevel + Number(inTag && !isTagStart)
      ) : '';

      // if (lineLength + tokenValue.length > width)
      //   output.push('\n', indents);
      // else
      if (inSpecialElement && !isStartTagSpecial) {
        output.push(tokenWhitespaceValue);
      }
      else {
        if (numNewlines)
          output.push(...Array(numNewlines).fill('\n'), indents);
        else
          output.push(' ');
      }
    }

    isStartTagSpecial = false;

    output.push(tokenValue);

    prevState = {
      pendingWhitespace, tokenValue
    };

    // Next state
    if (inStartTag && isTagEnd && !inEndTag && !isSelfCloseTagEnd && !(inSpecialElement && !isStartTagSpecial)) // A void tag is both start & end
      ++indentLevel;
    if (isTagEnd)
      inStartTag = inEndTag = false;
    i = token.end;
  }

  return output.join('')
    .replace(REGEX_LT_GT_R, match => LT_GT_LOOKUP_R[match])
    .replace(REGEX_REPLACE_CHAR, (all, g1) => innerQuotes[g1]);
}

export default format;
