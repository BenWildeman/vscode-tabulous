import { commands } from "vscode";
import common from "../common";

export function toggleTerminal(i: number) {
    return commands.registerCommand(`tabulous.showTerminal${i}`, async () => {
        const _terminal = Array.from(common.terminals.values())[i - 1].terminal;
        const terminalID = await _terminal.processId;

        common.terminals.forEach(({ terminal }, id) => {
            // Toggle or mark terminal as hidden
           id === terminalID ? terminal.toggleTerminal() : terminal.hide();
        });
    });
}
