// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
let xml2js = require("xml2js");
let fs = require("fs");

// Method to get text
const readTextFromOpenFile = () => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    return editor.document.getText();
  }
  return "";
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
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user

      let xmlContent = readTextFromOpenFile();
      var parser = new xml2js.Parser();
      parser.parseString(xmlContent, function (err, result) {
        let jsonStr = JSON.stringify(result);
        vscode.window.showInformationMessage(jsonStr);
        console.log(jsonStr);
        console.log("Done");
      });
      // vscode.window.showInformationMessage(xmlContent);
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
