import * as vscode from "vscode";
import { CliView } from "./cliView";
import { CliService } from "./cliService";

// 插件激活时
export function activate(context: vscode.ExtensionContext) {
  console.log("Congratulations, your extension is now active!");

  new CliService(context);
  new CliView(context);
}

// 插件卸载或禁用时，做一些清理工作
export function deactivate() {}
