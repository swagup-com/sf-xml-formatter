const vscode = require("vscode");
const xml2js = require("xml2js");
const fs = require("fs");
const { sort } = require("./sorter.js");
const {
  getFormatSettings,
  isFormatDisabled,
} = require("./settings/settings.js");

const encoding = "utf-8";
const sortConfigurationFilePath = __dirname + "/xmlformatter.cfg";
const packageJsonFilePath = __dirname + "/package.json";

const formatSettings = getFormatSettings();
const sortDefaultConfiguration = {
  relevantKeys: {},
  nonSortKeys: [],
};

const loadFileFromDisk = function (path) {
  let fileObj = undefined;
  try {
    if (fs.existsSync(path)) {
      fileObj = JSON.parse(
        fs.readFileSync(path, { encoding: encoding, flag: "r" })
      );
    }
  } catch (error) {
    console.log("Error trying to read file: " + path + " Details: " + error);
  }
  return fileObj;
};

const getSortConfiguration = function () {
  let options = loadFileFromDisk(sortConfigurationFilePath);

  if (!options) {
    options = sortDefaultConfiguration;
  }

  return options;
};

vscode.languages.registerDocumentFormattingEditProvider("xml", {
  provideDocumentFormattingEdits(document) {
    if (isFormatDisabled()) {
      return null;
    }

    let xmlContent = document.getText();
    if (!xmlContent) {
      return null;
    }

    var parser = new xml2js.Parser(formatSettings.parserOptions);
    let sortedXml;
    let errorMsg = "";

    parser.parseString(xmlContent, function (err, result) {
      if (result) {
        try {
          console.log("SORTING...");
          let builder = new xml2js.Builder(formatSettings.builderOptions);
          const sortConfiguration = getSortConfiguration();
          let sortedJsonObj = sort(result, sortConfiguration);
          sortedXml = builder.buildObject(sortedJsonObj);
          console.log("END.");
        } catch (error) {
          errorMsg = "An unexpected error has occurred. Details: " + error;
          console.error(errorMsg);
        }
      }
    });

    if (sortedXml) {
      vscode.window.showInformationMessage(
        "The file has been formatted successfully!"
      );
      const firstLine = document.lineAt(0);
      const lastLine = document.lineAt(document.lineCount - 1);
      const textRange = new vscode.Range(
        firstLine.range.start,
        lastLine.range.end
      );

      return [vscode.TextEdit.replace(textRange, sortedXml)];
    } else {
      if (!sortedXml) {
        vscode.window.showInformationMessage(errorMsg);
      }
      return null;
    }
  },
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let openRepoUrl = vscode.commands.registerCommand(
    "sf-xml-formatter.openDocs",
    function () {
      // Open the repository to view the doc
      let packageJson = loadFileFromDisk(packageJsonFilePath);
      if (packageJson) {
        console.log();
      }
      vscode.env.openExternal(
        vscode.Uri.parse(packageJson.repository.url.slice(0, -4))
      );
    }
  );

  context.subscriptions.push(openRepoUrl);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
