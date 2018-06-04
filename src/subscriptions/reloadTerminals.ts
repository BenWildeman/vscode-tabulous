import { commands, window, workspace } from "vscode";
import common, { loadTerminals, MAX_TERMINALS } from "../common";
import { StatusBarTerminal } from "../statusBarTerminal";
import { DefaultTerminal } from "../types";

function load() {
    if (common.terminals.length > 0) {
        if (!common.loaded) {
            setImmediate(() => {
                load()
            });
        }
    } else {
        const config = workspace.getConfiguration("tabulous");
        const defaultTerminals = config.get<DefaultTerminal[]>("defaultTerminals");
        
        common.loaded = true;
        loadTerminals(defaultTerminals);
        window.showInformationMessage("Default terminals reloaded");
    }
}

export function reloadTerminals() {
    return commands.registerCommand("tabulous.reloadDefaultTerminals", () => {
        const config = workspace.getConfiguration("tabulous");
        const defaultTerminals = config.get<DefaultTerminal[]>("defaultTerminals");

        if (defaultTerminals.length) {
            common.loaded = false;
            common.terminals.forEach((terminal) => {
                terminal.dispose();
            });

            load();
        } else {
            window.showWarningMessage("No default terminals specified in your settings, please add some then try again");
        }
    });
}
