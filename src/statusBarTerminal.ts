import { StatusBarItem, Terminal, window, workspace } from "vscode";
import { default as common, resolveWorkspaceFolderPath } from "./common";

export interface StatusBarTerminalOptions {
    terminalIndex: number;
    show: boolean;
    name?: string;
    terminal?: Terminal;
    cwd?: string;
}

export class StatusBarTerminal {
    private _item: StatusBarItem;
    private _showing: boolean = false;
    private _terminal: Terminal;

    constructor(
        terminalIndex: number,
        show: boolean,
        name?: string,
        terminal?: Terminal,
    ) {
        this._terminal = terminal ? terminal : window.createTerminal(name);

        this._item = window.createStatusBarItem(1, -10);
        this.setTerminalIndex(terminalIndex, name);
        this._item.show();

        if (show) {
            this.show();
        }
    }

    get name() {
        return this._terminal.name;
    }

    get processId() {
        return this._terminal.processId;
    }

    public showTerminal() {
        this._terminal.show();
        this.show();
    }

    public hideTerminal() {
        this._terminal.hide();
        this.hide();
    }

    public async show() {
        const config = workspace.getConfiguration("tabulous");
        const terminalID = await this._terminal.processId;
        this._showing = true;
        this._item.color = config.get("activeTabColor");
        this._item.tooltip = `Hide ${this.name} terminal`;
        this._item.text = `$(terminal) ${this.name}`;

        common.activeTerminal = terminalID;
    }

    public hide() {
        this._showing = false;
        this._item.color = undefined;
        this._item.tooltip = `Show ${this._terminal.name} terminal`;
        this._item.text = `$(terminal) ${this.name}`;

        common.activeTerminal = undefined;
    }

    public toggleTerminal() {
        this._showing ? this.hideTerminal() : this.showTerminal();
    }

    public setTerminalIndex(i: number, name?: string) {
        this._item.text = `$(terminal) ${name ? name : i + 1}`;
        this._item.tooltip = `Show ${name} terminal`;
        this._item.command = `tabulous.showTerminal${i + 1}`;
    }

    public sendCommand(command: string, execute: boolean = true) {
        this._terminal.sendText(command, execute);
    }

    public dispose() {
        this._item.dispose();
        this._terminal.dispose();
    }
}
