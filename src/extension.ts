import { resolve } from "path";
import { commands, ExtensionContext, Uri, window, workspace } from "vscode";

import common, { loadTerminals } from "./common";
import { registerContextMenuCommands } from "./contextMenu";
import { registerSubscriptions } from "./subscriptions";
import { DefaultTerminal } from "./types";

// tslint:disable-next-line: no-var-requires
const packageJSON: any = require("../package.json");

function checkForUpdatedVersion(context: ExtensionContext) {
    const { version } = packageJSON;
    const showChangelog = "Show Change Log";
    const tabulousVersionKey = "TabulousExtensionVersion";

    const storedVersion = context.globalState.get(tabulousVersionKey);

    if (
        (!storedVersion && version === "1.0.0") ||
        (storedVersion && version !== storedVersion)
    ) {
        window
            .showInformationMessage(
                `The Tabulous extension has been updated to version ${version} 🎉`,
                showChangelog,
            )
            .then((choice) => {
                if (choice === showChangelog) {
                    commands.executeCommand(
                        "markdown.showPreview",
                        Uri.file(resolve(__dirname, "../CHANGELOG.md")),
                    );
                }
            });
    }

    context.globalState.update(tabulousVersionKey, version);
}

export async function activate(context: ExtensionContext) {
    try {
        checkForUpdatedVersion(context);
        // vscode loves to start a terminal if you previously had one or more open. get rid of it
        await commands.executeCommand("workbench.action.terminal.kill");
        const config = workspace.getConfiguration("tabulous");
        const defaultTerminals = config.get<DefaultTerminal[]>(
            "defaultTerminals",
        );

        registerContextMenuCommands();
        registerSubscriptions(context);

        if (defaultTerminals?.length) {
            try {
                await loadTerminals(defaultTerminals);
            } catch {}
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
