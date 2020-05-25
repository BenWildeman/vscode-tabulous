import { commands, window } from "vscode";
import common from "../common";

export function renameTerminal() {
    return commands.registerCommand("tabulous.renameTerminal", async () => {
        const { activeTerminal } = common;
        try {
            if (!activeTerminal) {
                return window.showWarningMessage(
                    "Can only rename an active terminal",
                );
            }

            const name = await window.showInputBox();

            if (!name) {
                return window.showWarningMessage(
                    "Must provide a name to rename the active terminal",
                );
            }

            await commands.executeCommand(
                "workbench.action.terminal.renameWithArg",
                { name },
            );

            common.terminals.forEach((terminal) => {
                if (terminal.terminalID === activeTerminal) {
                    terminal.terminal.setTerimalTitle(name);
                }
            });
        } catch {}
    });
}
