import { Terminal } from "vscode";
import common from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export async function onDidOpenTerminal(openedTerminal: Terminal) {
    const terminalID = await openedTerminal.processId;
    const terminalExists = common.terminals.has(terminalID);

    if (!terminalExists) {
        for (const { terminal } of common.terminals.values()) {
            await terminal.processId; // ensure current terminals are initialized. Seems to fix #18
            terminal.hide();
        }

        const _terminal = new StatusBarTerminal({
            terminalIndex: common.terminalCount++,
            show: true,
            name: openedTerminal.name,
            terminal: openedTerminal,
        });

        common.terminals.set(terminalID, { terminalID, terminal: _terminal });
    }
}
