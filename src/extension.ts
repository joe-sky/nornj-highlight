import * as vscode from 'vscode';
import format from './format';

const typeScriptExtensionId = 'vscode.typescript-language-features';
const pluginId = 'typescript-nornj-plugin';
const configurationSection = 'nornj';

interface SynchronizedConfiguration {
  tags?: ReadonlyArray<string>;
  format: {
    enabled?: boolean;
  };
}

class HTMLDocumentFormatter implements vscode.DocumentFormattingEditProvider {
  public provideDocumentFormattingEdits(document: vscode.TextDocument): Thenable<vscode.TextEdit[]> {
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
    const indentSize = config.get('format.indentSize') as number;
    const indentChar = config.get('format.indentChar') as string;
    if (indentSize != null || indentChar != null) {
      indent = (indentChar || ' ').repeat(indentSize || 2);
    }

    const text = document.getText();
    const range = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
    return Promise.resolve([new vscode.TextEdit(range, format(text, indent /*, width*/))]);
  }
}

export async function activate(context: vscode.ExtensionContext) {
  const formatter = new HTMLDocumentFormatter();
  context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('nornj-html', formatter));

  const extension = vscode.extensions.getExtension(typeScriptExtensionId);
  if (!extension) {
    return;
  }

  await extension.activate();
  if (!extension.exports || !extension.exports.getAPI) {
    return;
  }
  const api = extension.exports.getAPI(0);
  if (!api) {
    return;
  }

  vscode.workspace.onDidChangeConfiguration(
    e => {
      if (e.affectsConfiguration(configurationSection)) {
        synchronizeConfiguration(api);
      }
    },
    undefined,
    context.subscriptions
  );

  synchronizeConfiguration(api);
}

function synchronizeConfiguration(api: any) {
  api.configurePlugin(pluginId, getConfiguration());
}

function getConfiguration(): SynchronizedConfiguration {
  const config = vscode.workspace.getConfiguration(configurationSection);
  const outConfig: SynchronizedConfiguration = {
    format: {}
  };

  withConfigValue<string[]>(config, 'taggedTemplate.tags', tags => {
    outConfig.tags = tags;
  });
  withConfigValue<boolean>(config, 'taggedTemplate.format.enabled', enabled => {
    outConfig.format.enabled = enabled;
  });

  return outConfig;
}

function withConfigValue<T>(config: vscode.WorkspaceConfiguration, key: string, withValue: (value: T) => void): void {
  const configSetting = config.inspect(key);
  if (!configSetting) {
    return;
  }

  // Make sure the user has actually set the value.
  // VS Code will return the default values instead of `undefined`, even if user has not don't set anything.
  if (
    typeof configSetting.globalValue === 'undefined' &&
    typeof configSetting.workspaceFolderValue === 'undefined' &&
    typeof configSetting.workspaceValue === 'undefined'
  ) {
    return;
  }

  const value = config.get<T | undefined>(key, undefined);
  if (typeof value !== 'undefined') {
    withValue(value);
  }
}
