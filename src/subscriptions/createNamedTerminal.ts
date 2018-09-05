import { window, commands } from "vscode";
import common, { MAX_TERMINALS } from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export function createNamedTerminal() {
    return commands.registerCommand("tabulous.createNamedTerminal", () => {
        if (common.terminals.size >= MAX_TERMINALS) {
            window.showInformationMessage(`This extension does not support more than ${MAX_TERMINALS} terminals.`);
            return;
        }

        window.showInputBox({
            placeHolder: "Enter the name of the new terminal"
        }).then(async name => {
            common.terminals.forEach(({ terminal }) => {
                terminal.markHidden();
            });

            const _terminal = new StatusBarTerminal(common.terminalCount++, true, name);
            const terminalID = await _terminal.processId;
            
            common.terminals.set(terminalID, {terminalID, terminal: _terminal});
        });
    });
}
