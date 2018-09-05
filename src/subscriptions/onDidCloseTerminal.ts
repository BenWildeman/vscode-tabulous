import { Terminal } from "vscode";
import common from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export async function onDidCloseTerminal(closedTerminal: Terminal) {
    const closedTerminalID = await closedTerminal.processId;
    const terminalExists = common.terminals.has(closedTerminalID);

    if (!terminalExists) {
        return;
    }
    
    common.terminalCount--;
    let end: Boolean = false;
    const terminalIndex = Array.from(common.terminals.values()).findIndex(t => t.terminalID === closedTerminalID);
    common.terminals.get(closedTerminalID).terminal.dispose();
    common.terminals.delete(closedTerminalID);

    if (terminalIndex === common.terminalCount) {
        end = true;
    }

    Array.from(common.terminals.values()).forEach(async ({ terminal }, i) => {
        terminal.setTerminalIndex(i, terminal.name);

        // Replicate the native VS Code showing of the next terminal when one is closed
        if (common.loaded && i === (end ? terminalIndex - 1 : terminalIndex)) {
           terminal.show();
        }
    });
}
