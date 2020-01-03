# CHANGELOG

## [v0.6.8] 2020.01.03

* 🌟 Added new icons for `nj.config` files.

## [v0.6.5] 2019.07.22

* 🌟 Added new icons for `.nornjrc` and `.npmrc`:

## [v0.6.3] 2019.07.05

* 🌟 The following syntax supported highlight:

```js
n-style="margin-left:100px"
n-style={`margin-left:100px`}
n-show={`foo.bar`}
<If condition={`foo.bar`}>
<Each of={`1 .. 10`}>
```

## [v0.6.1] 2019.06.13

* 🌟 The files with `nornj` or `nj` extension are highlighted in a new way for pure text template.

## [v0.5.1] 2019.04.14

* 🌟 The default tagged template tags add `html`.

## [v0.5.0] 2019.04.12

* 🌟 The following syntax supported formatting and intelliSense:

```js
nj`<html>{'Hello' + 'world'}</html>`
njs`<html>{'Hello' + 'world'}</html>`
t`<html>{'Hello' + 'world'}</html>`
```

## [v0.4.1] 2019.02.27

* 🌟 支持新语法高亮：

```js
nj`<html>{'Hello' + 'world'}</html>`
njs`<html>{'Hello' + 'world'}</html>`
t`<html>{'Hello' + 'world'}</html>`
```

* 🌟 模板内表达式支持语法高亮。

## [v0.4.0] 2019.02.25

* 🌟 支持新语法高亮：

```js
n`1 + 2 * ${3}`
s`margin-left:100px;padding:10`
```

* 🐞 修改`babel`文件图标，适配`v7`。

## [v0.3.1] 2018.06.20

* 🌟 新增`mobx`、`mobx-state-tree`文件图标。

## [v0.3.0] 2018.06.19

* 🌟 新增代码格式化功能。
* 🌟 新增`stylelint`文件图标。

## [v0.2.4] 2018.05.14

* 🌟 增加`文件图标主题`。

## [v0.2.2] 2018.03.11

* 🌟 增加`for`、`tmpl`、`include`等`NornJ扩展标签`智能提示。

## [v0.2.1] 2018.03.10

* 🌟 增加`if`、`each`、`switch`等`NornJ扩展标签`智能提示。
* 🌟 持续完善`html标签`智能提示。

## [v0.2.0] 2018.03.09

* 🌟 支持`html标签`智能提示。
* 🐞 修复注释快捷键bug。

## [v0.1.2] 2018.02.28

* 🌟 支持`NornJ扩展标签`语法高亮。
* 🌟 支持`NornJ插值变量`语法高亮。