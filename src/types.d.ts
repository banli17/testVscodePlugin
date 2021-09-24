import * as vscode from "vscode";

interface CliItemOptions {
  label: string;
  version: string;
  url: string;
  children?: Object[];
  collapsibleState?: vscode.TreeItemCollapsibleState;
  id: string;
}

export { CliItemOptions };
