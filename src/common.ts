import { StatusBarTerminal } from "./statusBarTerminal";
import { Common, DefaultTerminal } from "./types";

export const MAX_TERMINALS = 10;

const common: Common = {
    loaded: false,
    terminalCount: 0,
    terminals: new Map<number, {terminalID: number, terminal: StatusBarTerminal}>()
};

export function loadTerminals(defaultTerminals: DefaultTerminal[]) {
    defaultTerminals.forEach(async (terminal) => {
        const { name, directory, command, executeCommand = true } = terminal;
        const _terminal = new StatusBarTerminal(common.terminalCount++, false, name);
        const terminalID = await _terminal.processId;
        
        if (directory) {
            _terminal.sendCommand(`cd ${directory}`);
        }

        if (command) {
            _terminal.sendCommand(command, executeCommand);
        }

        common.terminals.set(terminalID, {terminalID, terminal: _terminal});
    });
}

export default common;
