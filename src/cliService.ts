import { execSync } from "child_process";
import * as vscode from "vscode";
import { CliItemOptions } from "./types";

export class CliService {
  constructor(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("cliService.createProject", (e) =>
      this.createProject(e)
    );
  }

  private async createProject(e: CliItemOptions) {
    const selectDir = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false,
    });
    if (selectDir && selectDir[0]) {
      try {
        execSync(`git clone ${e.url} ${selectDir[0].fsPath}`); // 克隆仓库
        vscode.window.showInformationMessage("创建完成");

        let pickResult: vscode.QuickPickItem | undefined;

        pickResult = await vscode.window.showQuickPick([
          { label: "打开项目" },
          { label: "不打开项目" },
        ]);

        if (pickResult?.label === "打开项目") {
          vscode.commands.executeCommand(
            "vscode.openFolder",
            selectDir[0].fsPath
          );
        }
      } catch (e: any) {
        console.log(e);
        vscode.window.showErrorMessage("创建失败, " + e.message);
      }
    }
  }
}
