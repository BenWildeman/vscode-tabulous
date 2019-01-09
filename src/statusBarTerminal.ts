import { StatusBarItem, Terminal, window, workspace } from "vscode";
import common from "./common";

export class StatusBarTerminal {
    private _item: StatusBarItem;
    private _showing: boolean = false;
    private _terminal: Terminal;

    constructor(terminalIndex: number, show: boolean, name?: string, terminal?: Terminal) {
        this._item = window.createStatusBarItem(1, -10);
        this.setTerminalIndex(terminalIndex, name);
        this._item.show();
        this._item.tooltip = `Show ${name} terminal`;

        this._terminal = terminal ? terminal : window.createTerminal(name);

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

    public async show() {
        const config = workspace.getConfiguration("tabulous");
        const terminalID = await this._terminal.processId;
        this._showing = true;
        this._item.color = config.get("activeTabColor");
        this._item.tooltip = `Hide ${this.name} terminal`;
        this._item.text = `$(terminal) ${this.name}`;
        this._terminal.show();

        common.activeTerminal = terminalID;
    }

    public hide() {
        this.markHidden();
        this._terminal.hide();
    }

    public markHidden() {
        this._showing = false;
        this._item.color = undefined;
        this._item.tooltip = `Show ${this._terminal.name} terminal`;
        this._item.text = `$(terminal) ${this.name}`;

        common.activeTerminal = undefined;
    }

    public toggle() {
        this._showing ? this.hide() : this.show();
    }

    public setTerminalIndex(i: number, name?: string) {
        this._item.text = `$(terminal) ${name ? name : (i + 1)}`;
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
