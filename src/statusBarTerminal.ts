import { StatusBarItem, WorkspaceConfiguration, Terminal, window, workspace } from "vscode";

export class StatusBarTerminal {
    private _item: StatusBarItem;
    private _showing: boolean = false;
    private _terminal: Terminal;

    constructor(terminalIndex: number, show: boolean, name?: string) {
        this._item = window.createStatusBarItem();
        this.setTerminalIndex(terminalIndex, name);
        this._item.show();

        this._terminal = window.createTerminal(name);

        if (show) {
            this.show();
        }
    }

    get name() {
        return this._terminal.name;
    }

    public show() {
        const config = workspace.getConfiguration("tabulous");
        this._showing = true;
        this._item.color = config.get("activeTabColor");
        this._terminal.show();
    }

    public hide() {
        this.markHidden();
        this._terminal.hide();
    }

    public markHidden() {
        this._showing = false;
        this._item.color = undefined;
    }

    public toggle() {
        this._showing ? this.hide() : this.show();
    }

    public setTerminalIndex(i: number, name?: string) {
        this._item.text = `$(terminal) ${name ? name : (i + 1)}`;
        this._item.command = `tabulous.showTerminal${i + 1}`; 
    }

    public hasTerminal(terminal: Terminal) {
        return this._terminal === terminal;
    }

    public sendCommand(command: string, execute: boolean = true) {
        this._terminal.sendText(command, execute);
    }

    public dispose() {
        this._item.dispose();
        this._terminal.dispose();
    }
}
