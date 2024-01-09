import { StatusBarTerminal } from "./statusBarTerminal";
import { Common, DefaultTerminal } from "./types";

export const MAX_TERMINALS = 15;

const common: Common = {
    loaded: false,
    terminalCount: 0,
    terminals: new Map<
        number,
        { terminalID: number; terminal: StatusBarTerminal }
    >(),
};

export async function loadTerminals(defaultTerminals: DefaultTerminal[]) {
    try {
        await Promise.all(
            defaultTerminals.map(async (terminal) => {
                const {
                    name,
                    directory: cwd,
                    command,
                    executeCommand = true,
                } = terminal;
                const _terminal = new StatusBarTerminal({
                    terminalIndex: common.terminalCount++,
                    show: false,
                    name,
                    cwd,
                });

                const terminalID = await _terminal.processId;

                if (terminalID) {
                    common.terminals.set(terminalID, {
                        terminalID,
                        terminal: _terminal,
                    });

                    if (command) {
                        _terminal.sendCommand(command, executeCommand);
                    }
                }
            }),
        );
    } catch {}
}

export default common;
