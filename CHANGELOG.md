# Tabulous Change Log

## 0.3.0

* Moved subscriptions into their own directory - cleans up extensions.ts
* Await the disposal of the lingering terminal on startup before doing anything. Hopefully fixes [#4](https://github.com/NitroGhost/vscode-tabulous/issues/4)
* No longer caches config within `StatusBarTerminal` so that `tabulous.activeColor` can be updated without reload
* Added `tabulous.reloadDefaultTerminals` so that it's possible to dispose of the terminals then reloads the defaults. Good for when the defaults have been updated so that you no longer have to reload VS Code
* Prefixed commands with "Tabulous: " to better distinguish the commands from others

## 0.2.1

* Forked from [terminal-tabs](https://github.com/Tyriar/vscode-terminal-tabs)
* Added `tabulous.createNamedTerminal` - creates a named terminal
* Added `tabulous.activeTabColor` - sets the active tab colour
* Added `Tabulous.defaultTerminals` - sets the default terminals to open when VS Code starts. Best used inside \<workspace-name\>.code-workspace
