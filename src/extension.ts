import { ExtensionContext, commands, window, workspace, Terminal } from "vscode";
import { createTerminal, createNamedTerminal, onDidCloseTerminal, onDidOpenTerminal, reloadTerminals, showTerminal } from "./subscriptions";
import { DefaultTerminal } from "./types";
import common, { MAX_TERMINALS, loadTerminals } from "./common";

export async function activate(context: ExtensionContext) {
    try {
        // vscode loves to start a terminal if you previously had one or more open. get rid of it
        await commands.executeCommand("workbench.action.terminal.kill");
        const config = workspace.getConfiguration("tabulous");
        const defaultTerminals = config.get<DefaultTerminal[]>("defaultTerminals");

        context.subscriptions.push(createNamedTerminal());
        context.subscriptions.push(createTerminal());
        context.subscriptions.push(reloadTerminals());

        for (let i = 1; i <= MAX_TERMINALS; i++) {
            context.subscriptions.push(showTerminal(i));
        }
        
        context.subscriptions.push(window.onDidCloseTerminal(onDidCloseTerminal));
        context.subscriptions.push((<any>window).onDidOpenTerminal(onDidOpenTerminal));

        if (defaultTerminals && defaultTerminals.length) {
            loadTerminals(defaultTerminals);
        }

        common.loaded = true;
    } catch {
        // can't do anything
    }
}

export function deactivate() {
    common.terminals.forEach(({ terminal }) => {
        terminal.dispose();
    });
}
