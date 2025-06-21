## 👀 Summary
Spyglass is a lightweight Unreal Engine editor plugin that builds an interactive graph showing how your plugins depend on one another. 
Hover a node to see detailed information, pan around the view and tweak layout forces to suit your preferences.

<div align="center">
  <img src="https://raw.githubusercontent.com/mykaadev/NsSpyglass/refs/heads/main/Resources/ShowcaseGraphOut.gif" width="250" /> &nbsp;
  <img src="https://raw.githubusercontent.com/mykaadev/NsSpyglass/refs/heads/main/Resources/ShowcaseGraphIn.gif" width="250" /> &nbsp;
  <img src="https://raw.githubusercontent.com/mykaadev/NsSpyglass/refs/heads/main/Resources/ShowcaseGraphMove.gif" width="250" />
</div>

## 📦 Features
- **Force-directed graph** that visualises plugin dependencies.
- **Hover info panel** describing authors, modules and references.
- **Customisable settings** to tune repulsion and centering forces.

## ⚙️ Requirements
Unreal Engine 5.2 or newer and a C++ project that can compile plugins.

## 🛠️ Installation
1. Clone or download this repository.
2. Copy the `NsSpyglass` folder into your project's `Plugins` directory. Create the `Plugins` folder if it does not exist.
3. Regenerate your project files so the engine can find the new plugin.
4. Open the Unreal Editor and enable **NsSpyglass** under `Edit` → `Plugins` then restart the editor.

## 🚀 Getting Started
Launch your Unreal Engine editor and navigate to `Window` → `Spyglass` → `Plugin Dependency Viewer`.
The plugin scans your project and displays an interactive graph of all plugins and their relationships.

### Navigating the Graph
- **Drag** nodes to reposition them.
- **Scroll** to zoom in and out.
- **Hover** a node to see details such as modules, plugin location and referenced plugins.
- Use the settings panel to adjust the repulsion and centering forces that control the layout.

### Understanding Dependencies
Each node represents a plugin. Lines between nodes show that one plugin references another. Use this view to quickly spot missing references or circular dependencies.

### Additional Help
If you run into issues, open an issue on GitHub :)




---

> [⬇ Download on GitHub](https://github.com/mykaadev/NsSpyglass)