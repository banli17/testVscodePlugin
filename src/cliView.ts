import * as vscode from "vscode";
import { CliProvider } from "./cliProvider";

export class CliView {
  todoProvicer: CliProvider;

  constructor(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("cliView.refresh", () => this.refresh());
    vscode.commands.registerCommand("cliView.add", () => this.add());
    vscode.commands.registerCommand("cliView.edit", () => this.edit());

    this.todoProvicer = new CliProvider("all");
    vscode.window.registerTreeDataProvider("cliList", this.todoProvicer);
  }

  private refresh() {
    this.todoProvicer.refresh();
  }

  private add() {
    vscode.window.showInformationMessage("add");
    console.log("hi add");
  }

  private edit() {
    console.log("hi edit");
    vscode.window.showInformationMessage("edit");
  }
}
