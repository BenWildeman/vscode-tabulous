import { Terminal } from "vscode";
import common from "../common";

export async function onDidChangeActiveTerminal(activeTerminal?: Terminal) {
    if (activeTerminal) {
        const terminalID = await activeTerminal.processId;

        common.terminals.forEach(({ terminal }, id) => {
            id === terminalID ? terminal.show() : terminal.hide();
        });
    }
}
