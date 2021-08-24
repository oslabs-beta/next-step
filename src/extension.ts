// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const path = require('path');
let toggle = false;

// console.log('Testing before I call the command');
export const setupExtension = () => {
  const nsPlus = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );

  const nsMinus = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );
  nsPlus.command = 'extension.generateMetrics';
  nsPlus.text = 'NS+';

  nsMinus.command = 'extension.stopListening';
  nsMinus.text = 'NS-';
 
  nsPlus.show();
  nsMinus.show();
};

/*
  user opens app - setupExtension shows buttons, functionality is off
  user clicks ns+ - helper function 'startListening' runs, functionality is on
  user clicks ns- - help function 'stopListening' runs, functionality is off
*/

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Next Step" is now active!');
  setupExtension();
  const output = vscode.window.createOutputChannel('METRICS');
  // this is getting the application's root folder filepath string from its uri
  if (!vscode.workspace.workspaceFolders) {
    return;
  }

  const rootFolderPath = vscode.workspace.workspaceFolders[0].uri.path;
  // const vscode.workspace.workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined;
  // this gives us the fileName - we join the root folder URI with the file we are looking for, which is metrics.json
  const fileName = path.join(rootFolderPath, '/metrics.json');

  //if toggle is false, button calls generateMetrics and set toggle to true
  //if toggle is true, button calls stopListening and set toggle to false

  const generateMetrics = vscode.commands.registerCommand(
    'extension.generateMetrics',
    async () => {
      console.log('Succesfully entered registerCommand');
      vscode.workspace.onDidChangeTextDocument(async (e) => {
        console.log('Succesfully entered onDidChangeTextDocument');
        if (e.document.uri.path === fileName) {
          // name the command to be called on any file in the application
          // this parses our fileName to an URI - we need to do this for when we run openTextDocument below
          const fileUri = vscode.Uri.parse(fileName);
          // open the file at the Uri path and get the text
          const metricData = await vscode.workspace
            .openTextDocument(fileUri)
            .then((document) => {
              return document.getText();
            });
          const parsedMetricData = JSON.parse(metricData);
          const fcp = (parsedMetricData.metrics[0]['FCP'] / 1000).toFixed(2);
          const cls = parsedMetricData.metrics[0]['CLS'].toFixed(2);
          const lcp = (parsedMetricData.metrics[0]['LCP'] / 1000).toFixed(2);
          const fid = (parsedMetricData.metrics[0]['FID'] / 1000).toFixed(2);
          const hydration = (
            parsedMetricData.metrics[0]['Next.js-hydration'] / 1000
          ).toFixed(2);
          const ttfb = (parsedMetricData.metrics[0]['TTFB'] / 1000).toFixed(2);
          const metricOutput = `FCP = ${fcp}s | CLS = ${cls} | LCP = ${lcp}s | FID = ${fid}s | HYDRATION = ${hydration}s| TTFB = ${ttfb}s`;
          output.clear();
          output.show();
          output.appendLine(metricOutput);
          
        }
      });
    }
  );
  const stopListening = vscode.commands.registerCommand(
    'extension.stopListening',
    async () => {
      // write functionality to stop displaying Metrics
      context.subscriptions[0].dispose();
    }
  );
  context.subscriptions.push(generateMetrics, stopListening);
}
// this method is called when your extension is deactivated
export function deactivate() {
  console.log('entered deactivate block');
}
