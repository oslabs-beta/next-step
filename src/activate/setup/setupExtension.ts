import * as vscode from 'vscode';
import { getVSCodeDownloadUrl } from 'vscode-test/out/util';

// create Status bar button and start as "Off"
export const setupExtension = () => {
  console.log('successfully set up button');
  const nextStepButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );

  nextStepButton.command = 'extension.generateMetrics';
  nextStepButton.text = 'NextStep: OFF🔴';
  nextStepButton.show();

  return nextStepButton;
};