import { existsSync } from "fs";
import { dirname, isAbsolute, resolve } from "path";
import { StatusBarItem, Terminal, window, workspace } from "vscode";
import common from "./common";

export interface StatusBarTerminalOptions {
    /**
     * Index of the status bar terminal (position on the status bar)
     */
    terminalIndex: number;
    /**
     * Whether or not to show terminal
     */
    show: boolean;
    /**
     * Which directory to start the terminal in
     */
    cwd?: string;
    /**
     * Name of the terminal
     */
    name?: string;
    /**
     * Reference to the native terminal
     */
    terminal?: Terminal;
}

export class StatusBarTerminal {
    private _item: StatusBarItem;
    private _showing: boolean = false;
    private _terminal: Terminal;

    constructor({
        terminalIndex,
        show,
        name,
        terminal,
        cwd,
    }: StatusBarTerminalOptions) {
        this._terminal = terminal
            ? terminal
            : window.createTerminal({ name, cwd: this.resolveDir(cwd) });

        this._item = window.createStatusBarItem(1, -10);
        this.setTerminalIndex(terminalIndex, name);
        this._item.show();

        if (show) {
            this.showTerminal();
        }
    }

    get name() {
        return this._terminal.name;
    }

    get processId() {
        return this._terminal.processId;
    }

    private resolveDir(path?: string) {
        const { workspaceFile, workspaceFolders } = workspace;
        const workspaceFileDir = dirname(workspaceFile.fsPath);

        if (path) {
            let cwd: string;

            if (!isAbsolute(path)) {
                if (workspaceFolders.length > 1) {
                    const matchedWorkspaceFolder = workspaceFolders.find(
                        (w) => w.name === path,
                    );

                    // Matched a workspace folder name, use this dir
                    if (matchedWorkspaceFolder) {
                        cwd = matchedWorkspaceFolder.uri.fsPath;
                    } else {
                        // Must be relative to the workspace file dir
                        cwd = resolve(workspaceFileDir, path);
                    }
                } else {
                    // Only one workspace folder, use this as relative dir
                    cwd = resolve(workspaceFolders[0].uri.fsPath, path);
                }
            } else {
                cwd = path;
            }

            // check to see if this dir actually exists, if not, fall through
            if (existsSync(cwd)) {
                return cwd;
            }

            window.showWarningMessage(
                // tslint:disable-next-line: max-line-length
                `Cannot open terminal for directory/workspace folder name: ${path}. Check to make sure this is correct. Used default location instead`,
            );
        }

        // More than one workspace folder, use workspace file dir
        if (workspace.workspaceFolders.length > 1) {
            return workspaceFileDir;
        }

        // Use workspace folder dir
        return workspaceFolders[0].uri.fsPath;
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
