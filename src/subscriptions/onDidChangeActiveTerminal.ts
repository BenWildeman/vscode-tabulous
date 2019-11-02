import { Terminal } from "vscode";
import common from "../common";

export async function onDidChangeActiveTerminal(terminal?: Terminal) {
    if (terminal) {
        const terminalID = await terminal.processId;

        common.terminals.forEach(({ terminal }, id) => {
           id === terminalID ? terminal.show() : terminal.hide();
        });
    }
}
