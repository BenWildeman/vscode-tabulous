import { window, commands } from "vscode";
import common, { MAX_TERMINALS } from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export function createTerminal() {
    return commands.registerCommand("tabulous.createTerminal", async () => {
        if (common.terminals.size >= MAX_TERMINALS) {
            window.showInformationMessage(`This extension does not support more than ${MAX_TERMINALS} terminals.`);
            return;
        }

        common.terminals.forEach(({ terminal }) => {
            terminal.markHidden();
        });

        const _terminal = new StatusBarTerminal(common.terminalCount++, true);
        const terminalID = await _terminal.processId;
        
        common.terminals.set(terminalID, {terminalID, terminal: _terminal});
    });
}
