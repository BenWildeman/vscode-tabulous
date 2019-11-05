import { commands, window, workspace } from "vscode";
import common, { MAX_TERMINALS } from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export function createTerminal() {
    return commands.registerCommand("tabulous.createTerminal", async () => {
        if (common.terminals.size >= MAX_TERMINALS) {
            window.showInformationMessage(
                `This extension does not support more than ${MAX_TERMINALS} terminals.`,
            );

            return;
        }

        try {
            let cwd: string;

            if (workspace.workspaceFolders.length > 1) {
                const workspaceFolder = await window.showWorkspaceFolderPick({
                    placeHolder: "Select working directory for new terminal",
                });

                cwd = workspaceFolder.uri.fsPath;
            }

            common.terminals.forEach(({ terminal }) => {
                terminal.hide();
            });

            const _terminal = new StatusBarTerminal({
                terminalIndex: common.terminalCount++,
                show: true,
                cwd,
            });
            const terminalID = await _terminal.processId;

            common.terminals.set(terminalID, {
                terminalID,
                terminal: _terminal,
            });
        } catch {
            // nothing we can do
            window.showErrorMessage("Unable to create terminal");
        }
    });
}
