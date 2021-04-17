# Salesforce XML Formatter

## Description

The main purpose of this extension is to provide a standard way to format and sort tags for metadata files (with extension ".xml" ) on Salesforce orgs. The tags inside the XMLs are sorted in a fixed order following Salesforce-specific set rules. The final goal is to can work easily with git using a repository shared by multiples developers minimizing the number of conflicts detected at the time of doing the merges.

## Features

This is a formatter extension, it implements the [Formatting API](https://code.visualstudio.com/blogs/2016/11/15/formatters-best-practices#_the-formatting-api) following the VS Code's guiding principles.
The core benefit of using the extension API for implementing a formatter comes from the exposure of the **Format Document** and **Format Selection** actions. [These actions](<(https://code.visualstudio.com/docs/editor/codebasics#_formatting)>) are available in the editor context menu, bound to keyboard shortcuts, and visible in the Command Palette.

## Installation

Install through VS Code extensions. Search for Salesforce XML Formatter

Can also be installed in VS Code: Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.

```
ext install swagup.sf-xml-formatter
```

## Default Formatter

To ensure that this extension is used over other extensions you may have installed, be sure to set it as the default formatter in your VS Code settings.

```json
"[xml]": {
    "editor.defaultFormatter": "swagup.sf-xml-formatter"
}
```

## Auto Format

You can add the following line in your VS Code settings to format automatically all XML files on save.

```json
"[xml]": {
    "editor.defaultFormatter": "swagup.sf-xml-formatter",
    "editor.formatOnSave": true
}
```

## How to use?

You can use the [Formatting](https://code.visualstudio.com/docs/editor/codebasics#_formatting) actions of VS Code: **Format Document** and **Format Selection**; or just use the configuration showed above in **Auto Format** section to format on save.

## Extension Settings

This extension contributes the following settings:

- `sf-xml-formatter.format.enabled`: Enable/disable ability to format document. Default is `true`.

## Disable the formatter

You can add the following the following line in your VS Code settings to disable the formatter.

```json
"sf-xml-formatter.format.enabled": false
```
