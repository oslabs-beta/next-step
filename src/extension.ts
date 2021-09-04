<<<<<<< HEAD
import { AsyncLocalStorage } from 'async_hooks';
import * as vscode from 'vscode';
import { getVSCodeDownloadUrl } from 'vscode-test/out/util';
const path = require('path');
let toggle = false;

export const setupExtension = () => {
  const nsButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );

  nsButton.command = 'extension.generateMetrics';
  nsButton.text = 'NextStep: OFF🔴';

  nsButton.show();

  return nsButton;
};


// this method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Next Step" is now active!');
  const nsButton = setupExtension();

  const output = vscode.window.createOutputChannel('METRICS');
  // this is getting the application's root folder filepath string from its uri
  if (!vscode.workspace.workspaceFolders) {
    return;
  }

  const rootFolderURI = vscode.workspace.workspaceFolders[0].uri;
  const rootFolderPath = vscode.workspace.workspaceFolders[0].uri.path;

  // this gives us the fileName - we join the root folder URI with the file we are looking for, which is metrics.json
  const fileName = path.join(rootFolderPath, '/NextStepMetrics.json');

  const generateMetrics = vscode.commands.registerCommand(
    'extension.generateMetrics',
    async () => {
      console.log('Succesfully entered registerCommand');
      toggle = true;
      nsButton.command = 'extension.stopListening';
      nsButton.text = 'NextStep: ON🟢';
      output.clear();
      output.show();
      output.appendLine('NextStep is active');

      // name the command to be called on any file in the application
      // this parses our fileName to an URI - we need to do this for when we run openTextDocument below
      const fileUri = vscode.Uri.parse(fileName);
      vscode.workspace.openTextDocument(fileUri);
      
      vscode.workspace.onDidChangeTextDocument(async (e) => {
        // name the command to be called on any file in the application
        // this parses our fileName to an URI - we need to do this for when we run openTextDocument below

        if (toggle) {
          console.log('Succesfully entered onDidChangeTextDocument');
        if (e.document.uri.path === fileName) {
          // open the file at the Uri path and get the text
          const metricData = await vscode.workspace
            .openTextDocument(fileUri)
            .then((document) => {
              return document.getText();
            });

          const { metrics , logs } = JSON.parse(metricData);
          const sum = { FCP: Array(), LCP: Array(), TTFB: Array(), CLS: Array(), FID: Array()};
          let val: keyof typeof sum;
          for (let i = 0; i < logs.length; i++) {
            
            for(val in sum) {
              if (logs[i][val] !== undefined) sum[val].push(logs[i][val]);
            }
          }
          const avg = {FCP: 0, CLS: 0, LCP: 0, FID: 0, TTFB: 0};
          for (val in sum) {
            const arr = sum[val];
            if (arr.length) avg[val] = arr.reduce((a, c) => a + c)/arr.length;
          }

          const fcp = (metrics.FCP / 1000).toFixed(2);
          const cls = metrics.CLS.toFixed(2);
          const lcp = (metrics.LCP / 1000).toFixed(2);
          const fid = metrics.FID ? (metrics.FID / 1000).toFixed(2) : 'N/A';
          const hydration = (metrics['Next.js-hydration'] / 1000).toFixed(2);
          const ttfb = (metrics.TTFB / 1000).toFixed(2);
          const fcp_score = isNaN(Number(fcp)) ? 'N/A  ⚫️' : Number(fcp) < 1.8 ? 'Good 🟢' : Number(fcp) < 3 ? 'Moderate 🟠' : 'Poor 🔴';
          const cls_score = isNaN(Number(cls)) ? 'N/A  ⚫️' : Number(cls) < 0.1 ? 'Good 🟢' : Number(cls) < 0.25 ? 'Moderate 🟠' : 'Poor 🔴';
          const lcp_score = isNaN(Number(lcp)) ? 'N/A  ⚫️' : Number(lcp) < 2.5 ? 'Good 🟢' : Number(lcp) < 4 ? 'Moderate 🟠' : 'Poor 🔴';
          const fid_score = isNaN(Number(fid)) ? 'N/A  ⚫️' : Number(fid) < 1 ? 'Good 🟢' : Number(fid) < 3 ? 'Moderate 🟠' : 'Poor 🔴';
          const ttfb_score = isNaN(Number(ttfb)) ? 'N/A  ⚫️' : Number(ttfb) < 0.6 ? 'Good 🟢' : 'Poor 🔴';

          const fcp_avg = (avg.FCP / 1000).toFixed(2);
          const cls_avg = avg.CLS.toFixed(2);
          const lcp_avg = (avg.LCP / 1000).toFixed(2);
          const fid_avg = avg.FID ? (avg.FID / 1000).toFixed(2) : 'N/A';
          const ttfb_avg = (avg.TTFB / 1000).toFixed(2);
          const fcp_avg_score = isNaN(Number(fcp_avg)) ? 'N/A  ⚫️' : Number(fcp_avg) < 1.8 ? 'Good 🟢' : Number(fcp_avg) < 3 ? 'Moderate 🟠' : 'Poor 🔴';
          const cls_avg_score = isNaN(Number(cls_avg)) ? 'N/A  ⚫️' : Number(cls_avg) < 0.1 ? 'Good 🟢' : Number(cls_avg) < 0.25 ? 'Moderate 🟠' : 'Poor 🔴';
          const lcp_avg_score = isNaN(Number(lcp_avg)) ? 'N/A  ⚫️' : Number(lcp_avg) < 2.5 ? 'Good 🟢' : Number(lcp_avg) < 4 ? 'Moderate 🟠' : 'Poor 🔴';
          const fid_avg_score = isNaN(Number(fid_avg)) ? 'N/A  ⚫️' : Number(fid_avg) < 1 ? 'Good 🟢' : Number(fid_avg) < 3 ? 'Moderate 🟠' : 'Poor 🔴';
          const ttfb_avg_score = isNaN(Number(ttfb_avg)) ? 'N/A  ⚫️' : Number(ttfb_avg) < 0.6 ? 'Good 🟢' : 'Poor 🔴';

          const fcp_link = 'https://web.dev/fcp/ ';
          const cls_link = 'https://web.dev/cls/ ';
          const lcp_link = 'https://web.dev/lcp/ ';
          const fid_link = 'https://web.dev/fid/ ';
          const ttfb_link = 'https://web.dev/time-to-first-byte/ ';
          const helpFixScore = `Want to improve "poor" areas?: ${fcp_score === 'Poor 🔴' ? fcp_link : ""}${cls_score === 'Poor 🔴' ? cls_link : ""}${fid_score === 'Poor 🔴' ? fid_link : ""}${lcp_score === 'Poor 🔴' ? lcp_link : ""}${ttfb_score === 'Poor 🔴' ? ttfb_link : ""}`;   
          const metricOutput = `------------------------------------------------
Metric | Value         | Moving Average (Last 5)
------------------------------------------------
FCP:   | ${fcp + 's'}${' '.repeat(7 - fcp.length)} ${fcp_score}  | ${fcp_avg} ${fcp_avg_score}
CLS:   | ${cls}${' '.repeat(8 - cls.length)} ${cls_score}  | ${cls_avg}
LCP:   | ${lcp + 's'}${' '.repeat(7 - lcp.length)} ${lcp_score}  | ${lcp_avg}
FID:   | ${fid + 's'}${' '.repeat(7 - fid.length)} ${fid_score}  | ${fid_avg}
TTFB:  | ${ttfb + 's'}${' '.repeat(7 - ttfb.length)} ${ttfb_score}  | ${ttfb_avg}
-----------------------------------------------\n`;
          output.clear();
          output.show();
          output.appendLine(metricOutput);
          output.appendLine(helpFixScore);
        }
        
          // [[fcp_score, fcp_link], [cls_score, cls_link], [lcp_score, lcp_link], [fid_score, fid_link], [ttfb_score, ttfb_link]].filter( score => {
          //   return score[0] === 'Poor 🔴';
          // }).forEach(score => output.appendLine(score[1]))
        
      };
    }
  );
  const stopListening = vscode.commands.registerCommand(
    'extension.stopListening',
    async () => {
      toggle = false;
      nsButton.command = 'extension.generateMetrics';
      nsButton.text = 'NextStep: OFF🔴';
      output.clear();
      // write functionality to stop displaying Metrics
      console.log('Successfully entered extension.stopListening');
    }
  );
  context.subscriptions.push(generateMetrics, stopListening);
 });
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('entered deactivate block');
}
=======
export { default as activate } from './activate/activate';
export { default as deactivate } from './deactivate/deactivate';
>>>>>>> 0dd13ffdc85843cf136f12e3a500d0c91cfff41a
