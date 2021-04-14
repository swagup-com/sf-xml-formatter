// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const xml2js = require("xml2js");
const fs = require("fs");
const sortKeysRecursive = require("sort-keys-recursive");

const parserOptions = {
  trim: true, // Trim the whitespace at the beginning and end of text nodes
};

const reverseAlphabeticalSort = function (a, b) {
  // console.log("a" + JSON.stringify(a) + "\nb" + JSON.stringify(b));
  if (a.hasOwnProperty("apexClass") && b.hasOwnProperty("apexClass")) {
    // console.log("a.apexClass: " + a.apexClass + "\nb.apexClass: " + b.apexClass);
    return a.apexClass < b.apexClass;
  }
  return a < b;
};

const sortOptions = {
  compareFunction: reverseAlphabeticalSort,
};

vscode.languages.registerDocumentFormattingEditProvider("xml", {
  provideDocumentFormattingEdits(document) {
    console.log("FORMATTING...");
    let xmlContent = document.getText();
    var parser = new xml2js.Parser(parserOptions);
    let sortedXml;
    let errorMsg = "";

    parser.parseString(xmlContent, function (err, result) {
      if (result) {
        try {
          console.log("SORTING...");
          let sortedJsonObj = sortKeysRecursive(result, sortOptions);
          let builder = new xml2js.Builder();
          sortedXml = builder.buildObject(sortedJsonObj);
          console.log("END.");
        } catch (error) {
          errorMsg = "An unexpected error has occurred. Details: " + error;
          console.log(errorMsg);
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
  console.log(
    'Congratulations, your extension "sf-xml-formatter" is now active!'
  );
  console.log(
    "language: " + vscode.window.activeTextEditor.document.languageId
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let openRepoUrl = vscode.commands.registerCommand(
    "sf-xml-formatter.openDocs",
    function () {
      // Open the repository to view the doc
      vscode.env.openExternal(
        vscode.Uri.parse("https://github.com/swagup-com/sf-xml-formatter")
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
