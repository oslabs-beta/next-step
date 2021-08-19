// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { table } from 'console';
import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');
import * as util from 'util';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "helloworld" is now active!');
  //name the command to be called on any file in the application
  const disposable = vscode.commands.registerCommand(
    'extension.generateMetrics',
    async () => {
      // this is getting the application's root folder filepath string from its uri
      const rootFolderPath = vscode.workspace.workspaceFolders[0].uri.path;
      // console.log('VSCODE WORKSPACE FOLDERS IS', rootFolderUri);
      // this gives us the fileName - we join the root folder URI with the file we are looking for, which is metrics.json
      const fileName = path.join(rootFolderPath, '/metrics.json');
      // this parses our fileName to an URI - we need to do this for when we run openTextDocument below 
      const fileUri = vscode.Uri.parse(fileName);
      //  console.log('FILEURI IS', fileUri);
      // open the file at the Uri path and get the text
      const metricData = await vscode.workspace
        .openTextDocument(fileUri)
        .then((document) => {
          return document.getText();
        });
      const parsedMetricData = JSON.parse(metricData);
      // console.log('FILENAME', fileName);
      // console.log('PARSED METRIC FILE IS', parsedMetricData.metrics);
      const fcp = parsedMetricData.metrics[0]["FCP"];
      const cls = parsedMetricData.metrics[0]["CLS"];
      const lcp = parsedMetricData.metrics[0]["LCP"];
      const metricOutput = `FCP = ${fcp} | CLS = ${cls} | LCP = ${lcp}`;
      const output = vscode.window.createOutputChannel('METRICS');
        output.show();
        output.appendLine(metricOutput);
        vscode.workspace.onDidChangeTextDocument(e => {
          if (e.document.uri.path === fileName) {
            console.log('It successfully logged when file was updated.');
          }
        });
    }
    
  );
  context.subscriptions.push(disposable);
}
// this method is called when your extension is deactivated
export function deactivate() {}
