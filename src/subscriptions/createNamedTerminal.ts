import { commands, window, workspace } from "vscode";
import common, { MAX_TERMINALS } from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export function createNamedTerminal() {
    return commands.registerCommand(
        "tabulous.createNamedTerminal",
        async () => {
            if (common.terminals.size >= MAX_TERMINALS) {
                window.showInformationMessage(
                    `This extension does not support more than ${MAX_TERMINALS} terminals.`,
                );
                return;
            }

            try {
                let cwd: string | undefined;

                if (
                    workspace.workspaceFolders &&
                    workspace.workspaceFolders.length > 1
                ) {
                    const workspaceFolder = await window.showWorkspaceFolderPick(
                        {
                            placeHolder:
                                "Select working directory for new terminal",
                        },
                    );

                    cwd = workspaceFolder?.uri.fsPath;
                }

                const name = await window.showInputBox({
                    placeHolder: "Enter name for new terminal",
                });

                common.terminals.forEach(({ terminal }) => {
                    terminal.hide();
                });

                const _terminal = new StatusBarTerminal({
                    terminalIndex: common.terminalCount++,
                    show: true,
                    name,
                    cwd,
                });

                const terminalID = await _terminal.processId;

                if (terminalID) {
                    common.terminals.set(terminalID, {
                        terminalID,
                        terminal: _terminal,
                    });
                }
            } catch {
                // nothing we can do
                window.showErrorMessage("Unable to create named terminal");
            }
        },
    );
}
