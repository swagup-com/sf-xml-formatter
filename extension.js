const vscode = require("vscode");
const xml2js = require("xml2js");
const fs = require("fs");
const path = require("path");
const { sort } = require("./sorter.js");
const {
  getFormatSettings,
  isFormatDisabled,
} = require("./settings/settings.js");

const encoding = "utf-8";
const sortConfigurationFilePath = `${__dirname}/xmlformatter.cfg`;
const packageJsonFilePath = `${__dirname}/package.json`;

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
    console.error(`Error trying to read file: "${path}". Details: ${error}`);
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

const formatDirectory = function (dirPath) {
  let xmlFiles = fs.readdirSync(dirPath).filter(isXMLFile);
  let errors = [];
  xmlFiles.forEach((xmlFile) => {
    let filePath = `${dirPath}${path.sep}${xmlFile}`;
    try {
      formatFile(filePath);
    } catch (err) {
      let errorMsg = `Error formatting file "${filePath}". Details: ${err.message}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
  });
  vscode.window.showErrorMessage(errors.join(" | "));
};

const formatFile = function (filePath) {
  let xmlContent = fs.readFileSync(filePath);
  let orderedXml = formatXML(xmlContent);
  fs.writeFileSync(filePath, orderedXml);
};

const isXMLFile = function (fileName) {
  let nameSplittedByDot = fileName.split(".");
  return nameSplittedByDot[nameSplittedByDot.length - 1] === "xml";
};
const formatXML = function (xmlContent) {
  const parser = new xml2js.Parser(formatSettings.parserOptions);
  let sortedXml;

  parser.parseString(xmlContent, function (err, result) {
    if (result) {
      let builder = new xml2js.Builder(formatSettings.builderOptions);
      const sortConfiguration = getSortConfiguration();
      let sortedJsonObj = sort(result, sortConfiguration);
      sortedXml = builder.buildObject(sortedJsonObj);
    } else {
      console.error(err);
      throw new Error(
        "The file could not be parsed. Please ensure your file is a correct XML file."
      );
    }
  });

  return sortedXml;
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

    try {
      let sortedXml = formatXML(xmlContent);
      const firstLine = document.lineAt(0);
      const lastLine = document.lineAt(document.lineCount - 1);
      const textRange = new vscode.Range(
        firstLine.range.start,
        lastLine.range.end
      );

      return [vscode.TextEdit.replace(textRange, sortedXml)];
    } catch (err) {
      console.error(err.message);
      vscode.window.showErrorMessage(err.message);
    }
  },
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // vscode.window.showInformationMessage("This is an info message!");

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
      vscode.env.openExternal(
        vscode.Uri.parse(packageJson.repository.url.slice(0, -4))
      );
    }
  );

  let formatDirCommand = vscode.commands.registerCommand(
    "sf-xml-formatter.formatDirectory",
    (context) => formatDirectory(context["fsPath"])
  );

  context.subscriptions.push(openRepoUrl);
  context.subscriptions.push(formatDirCommand);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
