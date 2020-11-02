import { lstatSync } from "fs";
import { basename, dirname } from "path";
import { commands, window } from "vscode";
import common, { MAX_TERMINALS } from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export function openTerminalHere() {
    return commands.registerCommand(
        "tabulous.openTerminalHere",
        async (context?: any) => {
            const uri = context?.fsPath
                ? context?.fsPath
                : window.activeTextEditor?.document?.uri?.fsPath ?? null;

            if (uri) {
                const stat = lstatSync(uri);
                const dirPath = stat.isDirectory() ? uri : dirname(uri);
                const dirName = stat.isDirectory()
                    ? basename(uri)
                    : basename(dirname(uri));

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
            }
        },
    );
}
