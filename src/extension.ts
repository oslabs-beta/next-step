// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { table } from 'console';
import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');
import * as util from "util";
import * as inspector from "inspector";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "helloworld" is now active!');

	// inspector.open();

	const session = new inspector.Session();
	session.connect();
	//make post into a promise function
	const post = <any>util.promisify(session.post).bind(session);

	await post("Debugger.enable");
	await post("Runtime.enable");

	const disposable = vscode.commands.registerCommand('extension.scanDocument', async () => {
		//access the active window that is running the extension
		const activeEditor = vscode!.window!.activeTextEditor;
		if (!activeEditor) {
			return;
		}

		//access the document text from the active window
		const document = activeEditor!.document;
		//translate the document path from uri to string
		const fileName = path.basename(document.uri.toString());

		console.log('DOCUMENT IS', document);
		console.log('FILENAME', fileName);

		//compile the script from the page
		const { scriptId }  = await post("Runtime.compileScript", {
			expression: document.getText(),
			sourceURL: fileName,
			persistScript: true
		});
		// const scriptIdObj = scriptId.exceptionDetails.stackTrace.callFrames;
		console.log('SCRIPTID IS', scriptId);
		// const scriptIdArray = scriptIdObj.map((element: Object) => element.scriptId);
		
		// run the script 
		await post("Runtime.runScript", {
			scriptId
		});

		// access variables from the app
		const data = await post("Runtime.globalLexicalScopeNames", {
			executionContextId: 1
		});
		console.log('DATA IS', data);

		// get the evaluated result from running the script
		const evaluate = await data.names.map(async (expression: string) => {
			console.log('EXPRESSION IS', expression);
			const { result: { value }} = await post("Runtime.evaluate", {
				expression,
				contextId: 1
			});
			console.log('VALUE IS', value);
				const output = vscode.window.createOutputChannel('METRICS');
				output.show();
				output.appendLine(value);
			const { result } = await post("Debugger.searchInContent", {
				scriptId,
				query: expression
			});
			console.log('RESULT IS', result);
		});
		console.log('EVALUATE IS', evaluate);
		
});
	//close the inspector
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}


// Debugger.searchInContent
// Searches for given string in script content.


// let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
	
// 	vscode.window.showInformationMessage('Hello VS Code from Hello World Test!');
// 	const output = vscode.window.createOutputChannel('Test');
// 	output.show();
// 	const data = `CLS is 3.2, FID is 0.4ms, LCP is 1.2s`;
// 	output.appendLine(data);
// });
// console.log('TABLE IS', table);


	// const editor = vscode.window.activeTextEditor;

	// 	if (editor) {
	// 		let document = editor.document;

	// 		// Get the document text
	// 		const documentText = document.getText();
	// 		// vscode.commands.executeCommand('vscode.openFolder', '/styles');
	// 		console.log(documentText);
			
	// 		// DO SOMETHING WITH `documentText`
	// }


	// console.log(vscode.workspace.getWorkspaceFolder(vscode.Uri.file('/metrics.js')));


	// // const result = fs.readFile('../metrics.js', function read(err: object, data: any) {
		// 	if (err) {
		// 		throw err;
		// 	};
		// 	return data;

		// });
		// console.log(result);
		// vscode.workspace.workspaceFile;
		// console.log(vscode.workspace.getWorkspaceFolder);