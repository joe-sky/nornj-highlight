# NornJ-highlight

Syntax highlight, snippets and file icon theme for [NornJ template engine](https://github.com/joe-sky/nornj)

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
|`<#if`|Defines a `<#if>` tag|
|`<#else`|Defines a `<#else>` tag|
|`<#elseif`|Defines a `<#elseif>` tag|
|`<#switch`|Defines a `<#switch>` tag|
|`<#case`|Defines a `<#case>` tag|
|`<#default`|Defines a `<#default>` tag|
|`<#unless`|Defines a `<#unless>` tag|
|`<#each`|Defines a `<#each>` tag|
|`<#for`|Defines a `<#for>` tag|
|`<#empty`|Defines a `<#empty>` tag|
|`<#props`|Defines a `<#props>` tag|
|`<#prop`|Defines a `<#prop>` tag|
|`<@propName`|Defines a `<@propName>` tag|
|`<#strProp`|Defines a `<#strProp>` tag|
|`<@@propName`|Defines a `<@@propName>` tag|
|`<#obj`|Defines a `<#obj>` tag|
|`<#list`|Defines a `<#list>` tag|
|`<#fn`|Defines a `<#fn>` tag|
|`<#tmpl`|Defines a `<#tmpl>` tag|
|`<#include`|Defines a `<#include>` tag|

> The code snippets is a fork of [abusaidm/html-snippets](https://github.com/abusaidm/html-snippets).

## How to enable Emmet html snippets

Add the following setting:

```js
"emmet.includeLanguages": {
  "nornj": "html"
}
```

## How to use file icon theme

After installation and activation, you should go in settings (`File` → `Preferences` on Windows, or `Code` → `Preferences` on OSX), choose `File Icon Theme`, and select `NornJ`.

> The file icon theme is a fork of [EmmanuelBeziat/vscode-great-icons](https://github.com/EmmanuelBeziat/vscode-great-icons).

## License

MIT