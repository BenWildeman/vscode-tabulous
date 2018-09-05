import { Terminal } from "vscode";
import common from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export async function onDidOpenTerminal(terminal: Terminal) {
    const terminalID = await terminal.processId;
    const terminalExists = common.terminals.has(terminalID);

    if (!terminalExists) {
        common.terminals.forEach(({ terminal }) => {
            terminal.markHidden();
        });

        const _terminal = new StatusBarTerminal(common.terminalCount++, true, terminal.name, terminal);
        common.terminals.set(terminalID, {terminalID, terminal: _terminal});
    }
}
