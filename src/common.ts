import { StatusBarTerminal } from "./statusBarTerminal";
import { Common, DefaultTerminal } from "./types";

export const MAX_TERMINALS = 10;

const common: Common = {
    loaded: false,
    terminalCount: 0,
    terminals: []
};

export function loadTerminals(defaultTerminals: DefaultTerminal[]) {
    defaultTerminals.forEach((terminal) => {
        const {name, directory, command} = terminal;
        const _terminal = new StatusBarTerminal(common.terminalCount++, false, name);
        
        if (directory) {
            _terminal.sendCommand(`cd ${directory}`);
        }

        if (command) {
            _terminal.sendCommand(command);
        }

        common.terminals.push(_terminal);
    });
}

export default common;
