import * as vscode from 'vscode';
import format from './format';

class HTMLDocumentFormatter implements vscode.DocumentFormattingEditProvider {
  public provideDocumentFormattingEdits(document: vscode.TextDocument):
    Thenable<vscode.TextEdit[]> {
    let tabSize = 4;
    let insertSpaces = true;

    const editor = vscode.window.activeTextEditor;
    if (editor) {
      tabSize = editor.options.tabSize as number;
      insertSpaces = editor.options.insertSpaces as boolean;
    }
    let indent = insertSpaces ? ' '.repeat(tabSize) : '\t';

    //const lang = document.languageId
    const uri = document.uri;
    //const langConfig = vscode.workspace.getConfiguration(`[${lang}]`, uri);
    const config = vscode.workspace.getConfiguration('nornj', uri);
    // const width =
    //   langConfig['editor.wordWrapColumn'] ||
    //   config.get('wordWrapColumn', 80);
    const indentSize = config.get('indentSize') as number;
    const indentChar = config.get('indentChar') as string;
    if (indentSize != null || indentChar != null) {
      indent = (indentChar || ' ').repeat((indentSize || 2));
    }

    const text = document.getText();
    const range = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length)
    );
    return Promise.resolve([
      new vscode.TextEdit(range, format(text, indent/*, width*/))
    ]);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const formatter = new HTMLDocumentFormatter();
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      'nornj', formatter
    )
  );
}
