import path = require("path");
import * as vscode from "vscode";
import axios from "axios";
import { CliItemOptions } from "./types";

export class CliProvider implements vscode.TreeDataProvider<Object> {
  type: string;

  private _onDidChangeTreeData: vscode.EventEmitter<Object | undefined | void> =
    new vscode.EventEmitter<Object | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<Object | undefined | void> =
    this._onDidChangeTreeData.event;
  data: [] | null;

  constructor(type: string) {
    this.type = type;

    this.data = null;
    this.refresh();
  }

  async getData() {
    this.data = null;
    try {
      const res = await axios.get(
        "https://raw.githubusercontent.com/banli17/testVscodePlugin/master/t_server/1.json"
      );
      //http://127.0.0.1:8081/1.json
      this.data = res.data;
    } catch (e) {
      this.data = [];
    }
  }

  async refresh() {
    await this.getData();
    this._onDidChangeTreeData.fire();
  }

  async getChildren(item: any) {
    const { data } = this;

    if (!data) {
      return Promise.resolve([{ label: "正在加载中..." }]);
    }

    if (!data.length) {
      return Promise.resolve([{ label: "暂无内容" }]);
    }

    if (item && item.children.length >= 1) {
      return Promise.resolve(
        item.children.map((d: CliItemOptions) => {
          return new CliItem(d);
        })
      );
    }

    return Promise.resolve(
      data.map((d: CliItemOptions) => {
        return new CliItem(d);
      })
    );
  }

  getTreeItem(element: Object): vscode.TreeItem {
    return element;
  }
}

class CliItem extends vscode.TreeItem {
  iconPath = {
    light: path.join(__dirname, "../resources/light/document.svg"),
    dark: path.join(__dirname, "../resources/dark/document.svg"),
  };
  url: string;
  children: Object[] | undefined;

  constructor(options: CliItemOptions) {
    super(
      options.label,
      options.children?.length
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.None // 这里用于创建子菜单, 通过 getChildren 递归
    );

    this.label = options.label;
    this.description = options.version;
    this.url = options.url;
    this.children = options.children;
    this.tooltip = `${this.label} v${options.version}`; // 悬浮显示

    // contextValue 用于判断 package.json 创建按钮 when viewItem
    this.contextValue = options.children ? "yes" : "no";
  }
}
