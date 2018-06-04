import { window, commands } from "vscode";
import common, { MAX_TERMINALS } from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export function createTerminal() {

    return commands.registerCommand("tabulous.createTerminal", () => {
        if (common.terminals.length >= MAX_TERMINALS) {
            window.showInformationMessage(`This extension does not support more than ${MAX_TERMINALS} terminals.`);
            return;
        }

        common.terminals.push(new StatusBarTerminal(common.terminalCount++, true));
    });
}
