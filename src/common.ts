import { StatusBarTerminal } from "./statusBarTerminal";
import { Common, DefaultTerminal } from "./types";
import * as path from 'path';
import { workspace, window } from "vscode";

export const MAX_TERMINALS = 10;

const common: Common = {
    loaded: false,
    terminalCount: 0,
    terminals: new Map<number, {terminalID: number, terminal: StatusBarTerminal}>()
};

export function loadTerminals(defaultTerminals: DefaultTerminal[]) {
    defaultTerminals.forEach(async (terminal) => {
        const { name, directory, command, executeCommand = true } = terminal;
        const _terminal = new StatusBarTerminal({
            terminalIndex: common.terminalCount++,
            show: false,
            name,
            cwd: directory
        });
        const terminalID = await _terminal.processId;

        if (command) {
            _terminal.sendCommand(command, executeCommand);
        } else {
            _terminal.sendCommand('', true);
        }

        common.terminals.set(terminalID, {terminalID, terminal: _terminal});
    });
}

function resolvePathTokens(p: string) {
    if (!p) { return p; }

    let tokens;
    while (tokens = /\${(workspaceFolder|workspaceRoot):?([^}]*)}/g.exec(p)) {
        const toReplace = tokens[0];
        const rootOrFolder = tokens[1];
        const folder = tokens[2];

        if (rootOrFolder === "workspaceRoot") {
            window.showWarningMessage("${workspaceRoot} is deprecated. Use ${workspaceFolder} instead.");
        }

        if (!folder && workspace.workspaceFolders.length > 1) {
            window.showErrorMessage("Default terminal directory start with ${workspaceFolder}, but the current workspace"
            + " contain multiple folders. Please specify which workspace folder, for example ${workspaceFolder:" + workspace.workspaceFolders[0] + "}");
        }

        const workspaceFolder = folder
            ? workspace.workspaceFolders.find(w => w.name === folder)
            : workspace.workspaceFolders[0];
        p = p.replace(toReplace, workspaceFolder.uri.fsPath);
    }

    return p;
}

export function resolveWorkspaceFolderPath(p: string) {
    if (!p) { return p; }

    p = resolvePathTokens(p);

    if (!path.isAbsolute(p)) {
        const cwdConfig = workspace.getConfiguration().get("terminal.integrated.cwd") as string;
        const basePath = cwdConfig 
            ? resolvePathTokens(cwdConfig)
            : workspace.workspaceFile
                ? path.dirname(workspace.workspaceFile.fsPath)
                : workspace.workspaceFolders[0].uri.fsPath;
        p = path.join(basePath, p);
    }

    return p;

    // const defaultTerminalCwd = 
    //     workspace.getConfiguration().get("terminal.integrated.cwd") as string
    //     || path.dirname(workspace.workspaceFile.fsPath);

    // const folderMatches = /^([^/\\]+)((\/|\\|$).*)/.exec(p);
    // if (folderMatches.length > 1) {
    //     const folder = folderMatches.length > 1 ? folderMatches[1] : '';
    //     const workspaceFolder = workspace.workspaceFolders.find(w => w.name === folder);
    //     if (workspaceFolder) {
    //         const suffixPath = folderMatches.length > 2 ? folderMatches[2] : '';
    //         return path.join(workspaceFolder.uri.fsPath, suffixPath);
    //     }
    // }

    // return path.join(defaultTerminalCwd, p);
}

export default common;
