import { StatusBarTerminal } from './statusBarTerminal';
import { ExtensionContext, commands, window, workspace, Terminal } from 'vscode';

const MAX_TERMINALS = 10;
let _terminalCounter = 0;
let _terminals: StatusBarTerminal[] = [];

interface DefaultTerminal {
    name?: string,
    directory?: string,
    command?: string
}

export function activate(context: ExtensionContext) {
    // vscode loves to start a terminal if you previously had one or more open. get rid of it
    commands.executeCommand('workbench.action.terminal.kill');
    const config = workspace.getConfiguration('tabulous');
    const defaultTerminals = config.get<DefaultTerminal[]>('defaultTerminals');

    if (defaultTerminals) {
        defaultTerminals.forEach((terminal) => {
            const {name, directory, command} = terminal;
            const _terminal = new StatusBarTerminal(_terminalCounter++, name);
            
            if (directory) {
                _terminal.sendCommand(`cd ${directory}`);
            }

            if (command) {
                _terminal.sendCommand(command);
            }

            _terminal.hide(); // it's not necessary to have the terminals open on creation
            _terminals.push(_terminal);
        });
    }

    context.subscriptions.push(commands.registerCommand('tabulous.createTerminal', () => {
        if (_terminals.length >= MAX_TERMINALS) {
            window.showInformationMessage(`This extension does not support more than ${MAX_TERMINALS} terminals.`);
            return;
        }
        _terminals.push(new StatusBarTerminal(_terminalCounter++));
    }));

    context.subscriptions.push(commands.registerCommand('tabulous.createNamedTerminal', () => {
        window.showInputBox({
            placeHolder: 'Enter the name of the new terminal'
        }).then(name => {
            _terminals.forEach((terminal) => {
                terminal.hide();
            });
            
            _terminals.push(new StatusBarTerminal(_terminalCounter++, name));
        });
    }));

    for (let i = 1; i <= MAX_TERMINALS; i++) {
        context.subscriptions.push(commands.registerCommand(`tabulous.showTerminal${i}`, (a) => {
            _terminals.forEach((terminal, index) => {
                // Toggle or mark terminal as hidden
                index === (i - 1) ? terminal.toggle() : terminal.markHidden();
            });
        }));
    }
    
    context.subscriptions.push(window.onDidCloseTerminal(onDidCloseTerminal));
}

function onDidCloseTerminal(terminal: Terminal) {
    _terminalCounter--;
    let terminalIndex: number, end: Boolean = false;
    _terminals.forEach((statusBarTerminal, i) => {
        if (statusBarTerminal.hasTerminal(terminal)) {
            terminalIndex = i; 
        }
    });
    _terminals[terminalIndex].dispose();
    // Push all terminals ahead of it back 1 index
    _terminals.splice(terminalIndex, 1);

    if (terminalIndex === _terminalCounter) {
        end = true;
    }
    
    _terminals.forEach((statusBarTerminal, i) => {
        _terminals[i].setTerminalIndex(i, statusBarTerminal.name);

        // Replicate the native VS Code showing of the next terminal when one is closed
        if (i === (end ? terminalIndex - 1 : terminalIndex)) {
           _terminals[i].show();
        }
    });
}

export function deactivate() {
    _terminals.forEach((terminal) => {
        terminal.dispose();
    });
}
