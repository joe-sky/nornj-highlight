# NornJ-highlight

Syntax highlight, snippets and file icon theme for [NornJ template engine](https://github.com/joe-sky/nornj) in VS Code.

Github: https://github.com/joe-sky/nornj-highlight

## Install

`ext install` in Visual Studio Code command line

Search for `nornj` and click install

## Syntax highlight and file icons screenshots

![nornj-template-example](images/screenshot.png)

## Snippets screenshots

![nornj-template-example](images/snippets.gif)

## Code Snippets

* Normal html tags, support all HTML tags

|trigger|snippet|
|-------|-------|
|`<div`|Defines a `<div>` tag|
|`<span`|Defines a `<span>` tag|
|`<input`|Defines a `<input>` tag|
|`<iframe`|Defines a `<iframe>` tag|
|`<textarea`|Defines a `<textarea>` tag|
|...|...|

* `NornJ` extension tags

|trigger|snippet|
|-------|-------|
|`<n-if`|Defines a `<n-if>` tag|
|`<n-else`|Defines a `<n-else>` tag|
|`<n-elseif`|Defines a `<n-elseif>` tag|
|`<n-switch`|Defines a `<n-switch>` tag|
|`<n-case`|Defines a `<n-case>` tag|
|`<n-default`|Defines a `<n-default>` tag|
|`<n-each`|Defines a `<n-each>` tag|
|`<n-for`|Defines a `<n-for>` tag|
|`<n-empty`|Defines a `<n-empty>` tag|
|`<n-prop`|Defines a `<n-prop>` tag|
|`<p-propName`|Defines a `<p-propName>` tag|
|`<n-strProp`|Defines a `<n-strProp>` tag|
|`<sp-propName`|Defines a `<sp-propName>` tag|
|`<n-obj`|Defines a `<n-obj>` tag|
|`<n-include`|Defines a `<n-include>` tag|

> The code snippets is a fork of [abusaidm/html-snippets](https://github.com/abusaidm/html-snippets).

## How to enable Emmet html snippets

Add the following setting:

```js
"emmet.includeLanguages": {
  "nornj-html": "html"
}
```

## How to use file icon theme

After installation and activation, you should go in settings (`File` → `Preferences` on Windows, or `Code` → `Preferences` on OSX), choose `File Icon Theme`, and select `NornJ`.

> The file icon theme is a fork of [EmmanuelBeziat/vscode-great-icons](https://github.com/EmmanuelBeziat/vscode-great-icons).

## Formatting

Code formatting has been supported, press `Shift + Alt + F`.

## Extension settings

|setting|type|default|effect|
|-------|----|-------|------|
|`nornj.format.indentSize`|number|2|Set indent size|
|`nornj.format.indentChar`|string|' '|Set indent char|
|`nornj.taggedTemplate.tags`|array|["html", "nj", "njs", "t"]|Tagged templates tag names|
|`nornj.taggedTemplate.format.enabled`|boolean|true|Enable/disable formatting of nornj template strings|

## License

MIT