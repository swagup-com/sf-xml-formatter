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
  console.log("a" + JSON.stringify(a));
  console.log("b" + JSON.stringify(b));
  if (a.hasOwnProperty("apexClass") && b.hasOwnProperty("apexClass")) {
    console.log("a.apexClass: " + a.apexClass);
    console.log("b.apexClass: " + b.apexClass);
    return a.apexClass < b.apexClass;
  }
  return a < b;
};

const sortOptions = {
  compareFunction: reverseAlphabeticalSort,
};

// Method to get text
const readTextFromOpenFile = () => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    return editor.document.getText();
  }
  return "";
};

// Method to write text
const writeTextOnOpenFile = (content) => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    console.log("file: " + editor.document.uri.fsPath);
    fs.writeFileSync(editor.document.uri.fsPath, content);
  }
};

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

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "sf-xml-formatter.helloWorld",
    function () {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from SF XML FORMATTER!"
      );
    }
  );

  let sortXmlCommand = vscode.commands.registerCommand(
    "sf-xml-formatter.formatXml",
    function () {
      let xmlContent = readTextFromOpenFile();
      var parser = new xml2js.Parser(parserOptions);
      parser.parseString(xmlContent, function (err, result) {
        let jsonStr = JSON.stringify(result);
        let sortedJsonObj = sortKeysRecursive(result, sortOptions);
        let sortedJsonObjStr = JSON.stringify(sortedJsonObj);

        let builder = new xml2js.Builder();
        let xml = builder.buildObject(sortedJsonObj);
        writeTextOnOpenFile(xml);
        vscode.window.showInformationMessage(
          "The file has been formatted successfully!"
        );

        console.log("jsonStr: " + jsonStr);
        console.log("sorted : " + sortedJsonObjStr);
        console.log("Done");
      });
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(sortXmlCommand);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
