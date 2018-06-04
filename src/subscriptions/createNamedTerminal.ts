import { window, commands } from "vscode";
import common, { MAX_TERMINALS } from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export function createNamedTerminal() {
    return commands.registerCommand("tabulous.createNamedTerminal", () => {
        window.showInputBox({
            placeHolder: "Enter the name of the new terminal"
        }).then(name => {
            common.terminals.forEach((terminal) => {
                terminal.hide();
            });
            
            common.terminals.push(new StatusBarTerminal(common.terminalCount++, true, name));
        });
    });
}
