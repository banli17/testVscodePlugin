import * as vscode from "vscode";
import { Todo } from "./cliProvider";
const download = require("download-git-repo");

export class CliService {
  constructor(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("cliService.createProject", (e) =>
      this.createProject(e)
    );
    // vscode.commands.registerCommand("cliService.editTodo", () =>
    //   this.editTodo()
    // );
  }

  private async createProject(e: Todo) {
    console.log("hi addTodo", e);
    const selectDir = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false,
    });
    if (selectDir) {
      const path = selectDir[0].fsPath;
      console.log("path", selectDir[0]);
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "正在创建中...",
          cancellable: true,
        },
        async () => {
          try {
            await new Promise<void>((resolve, reject) => {
              download(e.url, path, { clone: true }, (err: any) => {
                if (err) {
                  console.log(err);
                  resolve();
                  return;
                }
                resolve();
              });
            });
            vscode.window.showInformationMessage("创建完成");
            let isVscodeOpen = await vscode.window.showQuickPick([
              "打开项目",
              "不打开项目",
            ]);
            console.log(isVscodeOpen);
            if (isVscodeOpen === "打开项目") {
              let uri = vscode.Uri.file(path);
              try {
                let success = await vscode.commands.executeCommand(
                  "vscode.openFolder",
                  uri
                );
              } catch (e) {
                console.log(e);
              }
            }
          } catch (e: any) {
            vscode.window.showErrorMessage("创建失败, " + e.message);
          }
        }
      );
    }

    // console.log("ret", path);
  }

  // private editTodo() {
  //   console.log("hi editTodo");
  // }
}
