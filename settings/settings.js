const vscode = require("vscode");

const getFormatSettings = () => {
  const defaultSettings = {
    encoding: "utf-8",
    parserOptions: {
      trim: true, // Trim the whitespace at the beginning and end of text nodes
    },
    builderOptions: {
      xmldec: { version: "1.0", encoding: "UTF-8", standalone: null },
      renderOpts: { 'pretty': true, 'indent': '    ', 'newline': '\n' },
    },
  };

  return defaultSettings;
};

const isFormatDisabled = () => {
  return (
    vscode.workspace
      .getConfiguration("sf-xml-formatter.format")
      .get("enabled") === false
  );
};

module.exports = {
  getFormatSettings,
  isFormatDisabled,
};
