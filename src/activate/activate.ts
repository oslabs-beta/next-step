// import { AsyncLocalStorage } from 'async_hooks';
import * as vscode from 'vscode';
//import { getVSCodeDownloadUrl } from 'vscode-test/out/util';
import { setupExtension } from './setup/setupExtension';
import { generateOutput } from './generateOutput/generateOutput';
import * as path from 'path';

// activate function required for 
async function activate(context: vscode.ExtensionContext) {
  console.log("successfully entered activate");
  // create button and start as "Off"
  const nextStepButton = setupExtension();
  let toggle = false;

  // set context for Output panel of vscode window
  const output = vscode.window.createOutputChannel('METRICS');

  // this is getting the application's root folder filepath string from its uri
  if (!vscode.workspace.workspaceFolders) {
    return;
  }

  // this gives us the fileName - we join the root folder URI with the file we are looking for, which is in node modules
  const rootFolderPath = vscode.workspace.workspaceFolders[0].uri.path;
  const fileName = path.join(rootFolderPath, '/node_modules/next-step-metrics/next-step-metrics.json');

  // turn the extension on to start listening and generating metrics
  const generateMetrics = vscode.commands.registerCommand(
    'extension.generateMetrics',
    async () => {
      console.log('Succesfully entered registerCommand');
      toggle = true;
      // the button shows "Off" when user clicks to turn off extension
      // once the button is clicked, the button will show "Off"
      nextStepButton.command = 'extension.stopListening';
      nextStepButton.text = 'NextStep: ON🟢';
      output.clear();
      output.show();
      output.appendLine('NextStep is active');

      // name the command to be called on any file in the application
      // this parses our fileName to an URI - we need to do this for when we run openTextDocument below
      const fileUri = vscode.Uri.parse(fileName);
      vscode.workspace.openTextDocument(fileUri);
      
      // listen for changes to the metrics file and return to metricData
      vscode.workspace.onDidChangeTextDocument(async (e) => {
        if (toggle) {
          if (e.document.uri.path === fileName) {
            // open the file at the Uri path and get the text
            const metricData = await vscode.workspace
              .openTextDocument(fileUri)
              .then((document) => {
                return document.getText();
              });
            
            // format metricData and display in the Output panel
            generateOutput(metricData, output);
          }
        };
      });
    });

    // turn extension off
    const stopListening = vscode.commands.registerCommand(
      'extension.stopListening',
      async () => {
        toggle = false;
        // the button shows "Off" when user clicks to turn off extension
        // once the button is clicked, the button will show "Off"
        nextStepButton.command = 'extension.generateMetrics';
        nextStepButton.text = 'NextStep: OFF🔴';
        output.clear();
        // write functionality to stop displaying Metrics
        console.log('Successfully entered extension.stopListening');
      }
    );

    context.subscriptions.push(generateMetrics, stopListening);

};

export default activate;