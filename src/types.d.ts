import { StatusBarTerminal } from "./statusBarTerminal";

export interface Common {
    loaded: boolean;
    terminalCount: number;
    terminals: StatusBarTerminal[];
}

export interface DefaultTerminal {
    name?: string;
    directory?: string;
    command?: string;
    executeCommand?: boolean;
}
