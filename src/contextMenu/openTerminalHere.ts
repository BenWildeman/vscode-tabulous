import { lstatSync } from "fs";
import { basename, dirname } from "path";
import { commands, window, workspace } from "vscode";
import common, { MAX_TERMINALS } from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export function openTerminalHere() {
    return commands.registerCommand(
        "tabulous.openTerminalHere",
        async (context: any) => {
            const stat = lstatSync(context.fsPath);
            const dirPath = stat.isDirectory()
                ? context.fsPath
                : dirname(context.fsPath);
            const dirName = stat.isDirectory()
                ? basename(context.fsPath)
                : basename(dirname(context.fsPath));

            if (common.terminals.size >= MAX_TERMINALS) {
                window.showInformationMessage(
                    `This extension does not support more than ${MAX_TERMINALS} terminals.`,
                );
                return;
            }

            try {
                common.terminals.forEach(({ terminal }) => {
                    terminal.hide();
                });

                const _terminal = new StatusBarTerminal({
                    terminalIndex: common.terminalCount++,
                    show: true,
                    name: `${dirName}/`,
                    cwd: dirPath,
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
                window.showErrorMessage(
                    `Unable to open terminal in ${dirPath}`,
                );
            }
        },
    );
}
