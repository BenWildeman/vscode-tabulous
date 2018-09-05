import { StatusBarTerminal } from "./statusBarTerminal";

export interface Common {
    activeTerminal?: number;
    loaded: boolean;
    terminalCount: number;
    terminals: Map<number, {terminalID: number, terminal: StatusBarTerminal}>;
}

export interface DefaultTerminal {
    name?: string;
    directory?: string;
    command?: string;
    executeCommand?: boolean;
}
