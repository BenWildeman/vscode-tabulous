import { commands, window, workspace } from "vscode";
import common from "../common";
import { DefaultTerminal } from "../types";

export function showTerminal(i: number) {
    const config = workspace.getConfiguration("tabulous");
    const defaultTerminals = config.get<DefaultTerminal[]>("defaultTerminals");

    return commands.registerCommand(`tabulous.showTerminal${i}`, (a) => {
        common.terminals.forEach((terminal, index) => {
            // Toggle or mark terminal as hidden
            index === (i - 1) ? terminal.toggle() : terminal.markHidden();
        });
    });
}
