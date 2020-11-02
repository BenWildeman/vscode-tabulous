import { ExtensionContext, window } from "vscode";
import { MAX_TERMINALS } from "../common";
import { createNamedTerminal } from "./createNamedTerminal";
import { createTerminal } from "./createTerminal";
import { onDidChangeActiveTerminal } from "./onDidChangeActiveTerminal";
import { onDidCloseTerminal } from "./onDidCloseTerminal";
import { onDidOpenTerminal } from "./onDidOpenTerminal";
import { reloadTerminals } from "./reloadTerminals";
import { renameTerminal } from "./renameTerminal";
import { toggleTerminal } from "./toggleTerminal";

export function registerSubscriptions(context: ExtensionContext) {
    context.subscriptions.push(createNamedTerminal());
    context.subscriptions.push(createTerminal());
    context.subscriptions.push(renameTerminal());
    context.subscriptions.push(reloadTerminals());

    context.subscriptions.push(window.onDidCloseTerminal(onDidCloseTerminal));

    if ("onDidOpenTerminal" in window) {
        context.subscriptions.push(window.onDidOpenTerminal(onDidOpenTerminal));
    }

    context.subscriptions.push(
        window.onDidChangeActiveTerminal(onDidChangeActiveTerminal),
    );

    for (let i = 1; i <= MAX_TERMINALS; i++) {
        context.subscriptions.push(toggleTerminal(i));
    }
}
