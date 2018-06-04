import { Terminal } from "vscode";
import common from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";

export function onDidCloseTerminal(terminal: Terminal) {
    common.terminalCount--;
    let terminalIndex: number, end: Boolean = false;

    common.terminals.forEach((statusBarTerminal, i) => {
        if (statusBarTerminal.hasTerminal(terminal)) {
            terminalIndex = i; 
        }
    });

    common.terminals[terminalIndex].dispose();
    // Push all terminals ahead of it back 1 index
    common.terminals.splice(terminalIndex, 1);

    if (terminalIndex === common.terminalCount) {
        end = true;
    }
    
    common.terminals.forEach((statusBarTerminal, i) => {
        common.terminals[i].setTerminalIndex(i, statusBarTerminal.name);

        // Replicate the native VS Code showing of the next terminal when one is closed
        if (common.loaded && i === (end ? terminalIndex - 1 : terminalIndex)) {
           common.terminals[i].show();
        }
    });
}
