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

  // this is getting the application's root folder filepath string from its uri
  const rootFolderPath = vscode.workspace.workspaceFolders[0].uri.path;
  // this gives us the fileName - we join the root folder URI with the file we are looking for, which is metrics.json
  const fileName = path.join(rootFolderPath, '/metrics.json');
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );
  statusBarItem.command = 'extension.generateMetrics';
  statusBarItem.text = 'Next Step';
  statusBarItem.show();

  const disposable = vscode.commands.registerCommand(
    'extension.generateMetrics',
    async () => {
      vscode.workspace.onDidChangeTextDocument(async (e) => {
        if (e.document.uri.path === fileName) {
          // name the command to be called on any file in the application
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
          console.log('PARSED METRIC FILE IS', parsedMetricData.metrics);
          const fcp = (parsedMetricData.metrics[0]['FCP'] / 1000).toFixed(2);
          const cls = parsedMetricData.metrics[0]['CLS'].toFixed(2);
          const lcp = (parsedMetricData.metrics[0]['LCP'] / 1000).toFixed(2);
          const fid = (parsedMetricData.metrics[0]['FID'] / 1000).toFixed(2);
          const hydration = (
            parsedMetricData.metrics[0]['Next.js-hydration'] / 1000
          ).toFixed(2);
          const ttfb = (parsedMetricData.metrics[0]['TTFB'] / 1000).toFixed(2);
          const metricOutput = `FCP = ${fcp}s | CLS = ${cls} | LCP = ${lcp}s | FID = ${fid}s | HYDRATION = ${hydration}s| TTFB = ${ttfb}s`;
          const output = vscode.window.createOutputChannel('METRICS');
          output.show();
          output.appendLine(metricOutput);
          context.subscriptions.push(disposable);
        }
      });
    }
  );
}
// this method is called when your extension is deactivated
export function deactivate() {}
