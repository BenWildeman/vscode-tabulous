# Tabulous Change Log

## 1.1.0
* Added Rename Terminal command. Can be used as a replacement for the built-in rename terminal command (Updates the status bar icon without having to switch terminals)
* Added support for Touch Bar (macOS):
    * Create Named Terminal
    * Rename terminal
    * Reload default terminals

## 1.0.3
* Fixed edge-case where it's not possible to create terminal when through a new blank window
* Now waits for "default terminal reloaded" message before specifying as loaded
* Made sure terminal exists in the terminals list before trying to dispose it

## 1.0.2
* Fixed bug where it's not possible to create terminal without workspace, for real this time

## 1.0.1
* Fixed bug where it's not possible to create terminal without workspace

## 1.0.0
* Added multi-root workspace support
    * When creating a new terminal, you will be prompted to choose which workspace folder to open the terminal in
    * Now possible to use workspace folder name within the `directory` option of `defaultTerminals`
* Relative paths within `directory` option of `defaultTerminals` will now either resolve from the workspace folder, or the workspace file directory if it's a multi-root workspace
* Shows Change Log prompt when version is updated


## 0.5.0
* Add tooltips for tabs
* Create tabs on native terminal creation
* Track when active terminal changes natively

## 0.4.0
* Added executeCommand option for default terminals - Makes it possible to pretype the command when the default terminals are opened without actually executing them

## 0.3.1

* Added changelog

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
