import { Terminal } from "vscode";
import common from "../common";

export async function onDidCloseTerminal(closedTerminal: Terminal) {
    const closedTerminalID = await closedTerminal.processId;

    if (closedTerminalID) {
        const term = common.terminals.get(closedTerminalID);

        if (!term) {
            return;
        }

        common.terminalCount--;
        let end: boolean = false;
        const terminalIndex = Array.from(common.terminals.values()).findIndex(
            (t) => t.terminalID === closedTerminalID,
        );
        term.terminal.dispose();
        common.terminals.delete(closedTerminalID);

        if (terminalIndex === common.terminalCount) {
            end = true;
        }

        Array.from(common.terminals.values()).forEach(
            async ({ terminal }, i) => {
                terminal.setTerminalIndex(i, terminal.name);

                // Replicate the native VS Code showing of the next terminal when one is closed
                if (
                    common.loaded &&
                    i === (end ? terminalIndex - 1 : terminalIndex)
                ) {
                    terminal.show();
                }
            },
        );
    }
}
