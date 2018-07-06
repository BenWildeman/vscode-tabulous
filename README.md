# Tabulous

Adds tabs for each terminal process to the status bar. It works by registering toggleable status bar buttons when terminals are created via the commands below. This is an extended version of [terminal-tabs](https://github.com/Tyriar/vscode-terminal-tabs).

## Why forked?

This extension was forked because the original does not provide the functionality I needed. The original also isn't going to be updated as VS Code is working on implementing tabbed terminals, but in the mean time this extension provides this functionality until that is in place.

This extension provides the following extended functionality:

- Each tab can be toggled open and closed by clicking the tab in the status bar
- The active tab is highlighted so you can quickly determine which tab is open
- Provides full tab naming support. The original extension did not allow naming tabs, only giving a number to the tab
- Some settings for customisation

This extension provides the original commands that terminal-tabs provided, only renamed that can be keybound in your [keybindings.json](https://code.visualstudio.com/docs/customization/keybindings#_customizing-shortcuts) file:

- `tabulous.createTerminal`: Creates a terminal with an icon
- `tabulous.createNamedTerminal`: Creates a terminal with an icon that has a name (indicated in the dropdown)
- `tabulous.reloadDefaultTerminals`: Disposes of all the currently open terminals and reloads your default terminals set within your config. Good for reloading the defaults when they've been changed, without having to close and reopen VS Code
- `tabulous.showTerminal1`: Shows the first terminal
- `tabulous.showTerminal2`: Shows the second terminal
- `tabulous.showTerminal3`: Shows the third terminal
- `tabulous.showTerminal4`: Shows the fourth terminal
- `tabulous.showTerminal5`: Shows the fifth terminal
- `tabulous.showTerminal6`: Shows the sixth terminal
- `tabulous.showTerminal7`: Shows the seventh terminal
- `tabulous.showTerminal8`: Shows the eighth terminal
- `tabulous.showTerminal9`: Shows the ninth terminal
- `tabulous.showTerminal10`: Shows the tenth terminal

## Available Settings

This extension provides the following settings:

`tabulous.activeTabColor`: The colour of the active tab. This **must** be a valid css colour

`tabulous.defaultTerminals`: Default terminal settings for automatically opening terminals when VS Code opens. Best used inside .code-workspace settings

`tabulous.defaultTerminals` example:

```json
"tabulous.defaultTerminals": [{
    "name": "API",
    "directory": "absolute/path/to/api",
    "command": "npm start"
}, {
    "name": "App",
    "directory": "absolute/path/to/api",
    "command": "npm start",
    "executeCommand": false
}]
```

## Limitations

- The terminals can only be tracked when they are created by the terminal API (See [Microsoft/vscode#13267](https://github.com/Microsoft/vscode/issues/13267)). It is currently not possible to intercept creation of the terminal panel on restart for example.
- Creating a terminal with the default VS Code method **will** break this extension, especially toggling the terminals. Don't do it
