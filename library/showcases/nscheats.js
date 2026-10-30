// NsCheats showcase: a browser copy of the NsCheats window, with a console strip for the ns.Cheats commands.
// The layout and the rules port the plugin C++ code. A comment above each function names its source.
// All sources are in Source/NsCheatsRuntime/Private/NsCheatsSubsystem.cpp of the NsCheats repo.
(function () {
  "use strict";

  if (!window.NsShowcase) {
    return;
  }

  var MAX_LINES = 80;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  function button(className, text, key) {
    var node = el("button", className, text);
    node.type = "button";
    if (key) {
      node.dataset.key = key;
    }
    return node;
  }

  // FName::LexicalLess and FString operator< compare without case
  function compareIgnoreCase(a, b) {
    var left = a.toLowerCase();
    var right = b.toLowerCase();
    return left < right ? -1 : (left > right ? 1 : 0);
  }

  function sameName(a, b) {
    return a.toLowerCase() === b.toLowerCase();
  }

  // Slate TDefaultNumericTypeInterface<float>::ToString: 1 to 6 fractional digits, no grouping
  function formatFloat(value) {
    var text = Math.fround(value).toFixed(6).replace(/0+$/, "");
    return /\.$/.test(text) ? text + "0" : text;
  }

  function formatValue(value) {
    if (typeof value === "number" && !Number.isInteger(value)) {
      return formatFloat(value);
    }
    return String(value);
  }

  function parseValue(text) {
    if (text === "true" || text === "false") {
      return text === "true";
    }
    return text !== "" && !isNaN(Number(text)) ? Number(text) : text;
  }

  // Reads the entries of the fragment. Builder defaults: Tab "Debug", Category "General", SortOrder 0 (NsCheatTypes.h:82)
  function readEntries(root, values) {
    var list = root.querySelector(":scope > ul");
    var items = list ? Array.prototype.slice.call(list.children) : [];
    return items.map(function (item) {
      var label = item.querySelector(":scope > b");
      var description = item.querySelector(":scope > span");
      var entry = {
        id: item.dataset.id || "",
        type: item.dataset.type || "button",
        tab: item.dataset.tab || "Debug",
        section: item.dataset.section || "General",
        sort: Number(item.dataset.sort) || 0,
        label: label ? label.textContent.trim() : "",
        description: description ? description.textContent.trim() : "",
        variable: item.dataset.var || "",
        text: item.dataset.text || "",
        log: item.dataset.log || "",
        exec: item.dataset.exec || "",
        add: Number(item.dataset.add) || 0,
        action: item.dataset.action || "",
        options: [],
        actions: []
      };
      item.querySelectorAll(":scope > ul > li").forEach(function (child, index) {
        if (entry.type === "picker") {
          entry.options.push({ value: child.dataset.value || child.textContent.trim(), label: child.textContent.trim() });
        } else {
          entry.actions.push({ id: String(index), label: child.textContent.trim(), log: child.dataset.log || "", exec: child.dataset.exec || "" });
        }
      });
      if (entry.variable && !(entry.variable in values) && item.dataset.value !== undefined) {
        values[entry.variable] = parseValue(item.dataset.value);
      }
      return entry;
    });
  }

  // An entry has a bound execute delegate when the fragment gives it an action
  function hasExecute(entry) {
    return !!(entry.action || entry.log || entry.exec || entry.add);
  }

  window.NsShowcase.register(".ns-cheats", function (root) {
    var values = Object.create(null);
    var fragmentEntries = readEntries(root, values);
    if (fragmentEntries.length === 0) {
      throw new Error("no entries");
    }
    var entries = [];
    var startTime = Date.now();
    var startSelection = (root.dataset.start || "").split("/");
    var state = { open: true, search: "", tab: startSelection[0] || "", section: startSelection[1] || "" };
    var updaters = [];
    var history = [];
    var historyIndex = 0;

    // Window: title bar, search row, tab bar, then the section list and the entries panel
    var app = el("div", "ns-cheats-app");
    var win = el("div", "ns-cheats-window");
    win.setAttribute("role", "region");
    win.setAttribute("aria-label", "NsCheats window");
    var titleBar = el("div", "ns-cheats-titlebar");
    titleBar.appendChild(el("span", "ns-cheats-title", "NsCheats"));
    var closeButton = button("ns-cheats-close", "×");
    closeButton.setAttribute("aria-label", "Close the window");
    titleBar.appendChild(closeButton);
    win.appendChild(titleBar);

    var topRow = el("div", "ns-cheats-top");
    var search = el("input", "ns-cheats-search");
    search.type = "search";
    search.placeholder = "Search cheats...";
    search.setAttribute("aria-label", "Search cheats");
    search.spellcheck = false;
    var reload = button("ns-cheats-button", "Reload");
    topRow.appendChild(search);
    topRow.appendChild(reload);
    win.appendChild(topRow);

    var tabBar = el("div", "ns-cheats-tabs");
    tabBar.setAttribute("role", "group");
    tabBar.setAttribute("aria-label", "Tabs");
    win.appendChild(tabBar);

    var body = el("div", "ns-cheats-body");
    var sectionBox = el("div", "ns-cheats-sections");
    sectionBox.appendChild(el("div", "ns-cheats-heading", "Sections"));
    var sectionList = el("div", "ns-cheats-section-list");
    sectionList.setAttribute("role", "group");
    sectionList.setAttribute("aria-label", "Sections");
    sectionBox.appendChild(sectionList);
    var panel = el("div", "ns-cheats-panel");
    var panelHead = el("div", "ns-cheats-panel-head");
    var panelTitle = el("span", "ns-cheats-panel-title");
    var panelCount = el("span", "ns-cheats-panel-count");
    panelHead.appendChild(panelTitle);
    panelHead.appendChild(panelCount);
    var rows = el("div", "ns-cheats-rows");
    panel.appendChild(panelHead);
    panel.appendChild(rows);
    body.appendChild(sectionBox);
    body.appendChild(panel);
    win.appendChild(body);

    var closed = el("div", "ns-cheats-closed");
    closed.appendChild(el("span", "", "The window is closed. "));
    var openButton = button("ns-cheats-button", "Run ns.Cheats.Open");
    closed.appendChild(openButton);
    closed.hidden = true;

    // Console strip: the output lines, a prompt, and example commands
    var consoleBox = el("div", "ns-cheats-console");
    var log = el("ol", "ns-cheats-log");
    log.setAttribute("aria-live", "polite");
    log.setAttribute("aria-label", "Console output");
    var prompt = el("label", "ns-cheats-prompt");
    prompt.appendChild(el("span", "ns-cheats-caret", ">"));
    var commandInput = el("input", "ns-cheats-command");
    commandInput.type = "text";
    commandInput.spellcheck = false;
    commandInput.autocomplete = "off";
    commandInput.setAttribute("autocapitalize", "off");
    commandInput.setAttribute("aria-label", "Console command");
    commandInput.placeholder = "ns.Cheats.Toggle";
    prompt.appendChild(commandInput);
    var chips = el("div", "ns-cheats-chips");
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", "Example commands");
    root.querySelectorAll(":scope > p code").forEach(function (code) {
      var chip = button("ns-cheats-chip", code.textContent.trim());
      chip.addEventListener("click", function () {
        runCommand(chip.textContent);
      });
      chips.appendChild(chip);
    });
    consoleBox.appendChild(log);
    consoleBox.appendChild(prompt);
    consoleBox.appendChild(chips);

    app.appendChild(win);
    app.appendChild(closed);
    app.appendChild(consoleBox);
    var caption = root.querySelector("figcaption");
    root.insertBefore(app, caption ? caption.nextSibling : root.firstChild);

    // kind: input, log, warn, exec, call, or note
    function addLine(kind, text) {
      text.split("\n").forEach(function (line) {
        if (line === "") {
          return;
        }
        log.appendChild(el("li", "ns-cheats-line ns-cheats-line--" + kind, line));
      });
      while (log.children.length > MAX_LINES) {
        log.removeChild(log.firstChild);
      }
      log.scrollTop = log.scrollHeight;
    }

    function fill(template) {
      return template.replace(/\{(\w+)\}/g, function (match, name) {
        if (name === "time") {
          return formatFloat(Math.round((Date.now() - startTime) / 100) / 10);
        }
        return name in values ? formatValue(values[name]) : match;
      });
    }

    // NsCheatsSubsystem.cpp:177 (RegisterCheatEntry)
    function registerEntry(entry) {
      if (!entry.id) {
        addLine("warn", "LogNsCheats: Warning: Ignoring cheat entry with empty Id.");
        return;
      }
      entries = entries.filter(function (candidate) { return !sameName(candidate.id, entry.id); });
      entries.push(entry);
      entries.sort(function (a, b) {
        return compareIgnoreCase(a.tab, b.tab) || compareIgnoreCase(a.section, b.section) || a.sort - b.sort;
      });
    }

    // NsCheatsSubsystem.cpp:396 (DumpRegisteredCheats)
    function dumpRegisteredCheats() {
      var result = "NsCheats Registered Entries\n";
      entries.forEach(function (entry) {
        result += "- [" + entry.tab + "/" + entry.section + "] " + entry.label + " (" + entry.id + ")\n";
      });
      addLine("log", "LogNsCheats: " + result);
    }

    function engineExec(command) {
      addLine("exec", "GEngine->Exec: " + command);
    }

    // NsCheatsSubsystem.cpp:1145 (ExecuteEntryAction). The demo action changes demo values and writes to the strip.
    function executeEntryAction(entry) {
      if (!hasExecute(entry)) {
        return false;
      }
      if (entry.action === "dump") {
        dumpRegisteredCheats();
      }
      if (entry.add && entry.variable) {
        values[entry.variable] = (Number(values[entry.variable]) || 0) + entry.add;
      }
      if (entry.exec) {
        engineExec(entry.exec);
      }
      if (entry.log) {
        addLine("log", fill(entry.log));
      }
      return true;
    }

    function setValue(entry, value, shown) {
      values[entry.variable] = value;
      addLine("call", "Set delegate: " + entry.id + " = " + shown);
    }

    // NsCheatsSubsystem.cpp:1096 (EntryMatchesSearch)
    function entryMatchesSearch(entry) {
      if (!state.search) {
        return true;
      }
      var blob = [entry.label, entry.description, entry.id, entry.tab, entry.section].join(" ");
      return blob.toLowerCase().indexOf(state.search.toLowerCase()) >= 0;
    }

    function uniqueSorted(list) {
      var out = [];
      list.forEach(function (name) {
        if (!out.some(function (other) { return sameName(other, name); })) {
          out.push(name);
        }
      });
      return out.sort(compareIgnoreCase);
    }

    // NsCheatsSubsystem.cpp:1041 (GetVisibleTabs)
    function getVisibleTabs() {
      return uniqueSorted(entries.filter(entryMatchesSearch).map(function (entry) { return entry.tab; }));
    }

    // NsCheatsSubsystem.cpp:1057 (GetVisibleSectionsForTab)
    function getVisibleSectionsForTab(tab) {
      return uniqueSorted(entries.filter(function (entry) {
        return sameName(entry.tab, tab) && entryMatchesSearch(entry);
      }).map(function (entry) { return entry.section; }));
    }

    // NsCheatsSubsystem.cpp:1073 (GetVisibleEntriesForSelection)
    function getVisibleEntries() {
      return entries.filter(function (entry) {
        return sameName(entry.tab, state.tab) && sameName(entry.section, state.section) && entryMatchesSearch(entry);
      }).sort(function (a, b) {
        return (a.sort - b.sort) || compareIgnoreCase(a.label, b.label);
      });
    }

    function containsName(list, name) {
      return list.some(function (item) { return sameName(item, name); });
    }

    // NsCheatsSubsystem.cpp:1115 (NormalizeSelection). An empty name stands for NAME_None.
    function normalizeSelection() {
      var tabs = getVisibleTabs();
      if (tabs.length === 0) {
        state.tab = "";
        state.section = "";
        return;
      }
      if (!containsName(tabs, state.tab)) {
        state.tab = tabs[0];
      }
      var sections = getVisibleSectionsForTab(state.tab);
      if (sections.length === 0) {
        state.section = "";
        return;
      }
      if (!containsName(sections, state.section)) {
        state.section = sections[0];
      }
    }

    // NsCheatsSubsystem.cpp:549 (BuildTabBar)
    function buildTabBar(tabs) {
      tabBar.textContent = "";
      tabs.forEach(function (tab) {
        var node = button("ns-cheats-tab", tab, "tab:" + tab);
        node.setAttribute("aria-pressed", sameName(tab, state.tab) ? "true" : "false");
        node.addEventListener("click", function () {
          state.tab = tab;
          var sections = getVisibleSectionsForTab(tab);
          state.section = sections.length > 0 ? sections[0] : "";
          rebuild();
        });
        tabBar.appendChild(node);
      });
      if (tabs.length === 0) {
        tabBar.appendChild(el("span", "ns-cheats-empty", "No cheats registered."));
      }
    }

    // NsCheatsSubsystem.cpp:588 (BuildSectionList)
    function buildSectionList(sections) {
      sectionList.textContent = "";
      sections.forEach(function (section) {
        var node = button("ns-cheats-section", section, "section:" + section);
        node.setAttribute("aria-pressed", sameName(section, state.section) ? "true" : "false");
        node.addEventListener("click", function () {
          state.section = section;
          rebuild();
        });
        sectionList.appendChild(node);
      });
      if (sections.length === 0) {
        sectionList.appendChild(el("span", "ns-cheats-empty", "No sections."));
      }
    }

    function rowFrame(entry) {
      var row = el("div", "ns-cheats-row");
      row.appendChild(el("div", "ns-cheats-row-name", entry.label));
      row.appendChild(el("div", "ns-cheats-row-desc", entry.description || entry.id));
      var controls = el("div", "ns-cheats-row-controls");
      row.appendChild(controls);
      return { row: row, controls: controls };
    }

    function runButton(entry) {
      var node = button("ns-cheats-button", "Run", "run:" + entry.id);
      node.setAttribute("aria-label", "Run " + entry.label);
      if (entry.description) {
        node.title = entry.description;
      }
      node.addEventListener("click", function () {
        executeEntryAction(entry);
        refresh();
      });
      return node;
    }

    // NsCheatsSubsystem.cpp:708 (BuildCheatEntryWidget: button, toggle, float, and debug text rows)
    function buildCheatEntryWidget(entry) {
      if (entry.type === "picker") {
        return buildPickerWidget(entry);
      }
      if (entry.type === "text") {
        return buildTextWidget(entry);
      }
      if (entry.type === "row") {
        return buildButtonRowWidget(entry);
      }
      var frame = rowFrame(entry);
      if (entry.text) {
        var debug = el("div", "ns-cheats-debug");
        frame.controls.appendChild(debug);
        updaters.push(function () { debug.textContent = fill(entry.text); });
      }
      if (entry.type === "float") {
        var number = el("input", "ns-cheats-field ns-cheats-number");
        number.type = "text";
        number.inputMode = "decimal";
        number.dataset.key = "float:" + entry.id;
        number.setAttribute("aria-label", entry.label);
        number.addEventListener("change", function () {
          var parsed = Number(number.value.trim());
          if (number.value.trim() === "" || !isFinite(parsed)) {
            number.value = formatFloat(values[entry.variable]);
            return;
          }
          setValue(entry, Math.fround(parsed), formatFloat(parsed));
          refresh();
        });
        frame.controls.appendChild(number);
        updaters.push(function () {
          if (document.activeElement !== number) {
            number.value = formatFloat(Number(values[entry.variable]) || 0);
          }
        });
      }
      if (entry.type === "toggle") {
        var check = el("input", "ns-cheats-check");
        check.type = "checkbox";
        check.dataset.key = "toggle:" + entry.id;
        check.setAttribute("aria-label", entry.label);
        check.addEventListener("change", function () {
          setValue(entry, check.checked, String(check.checked));
          refresh();
        });
        frame.controls.appendChild(check);
        updaters.push(function () { check.checked = !!values[entry.variable]; });
      } else if (hasExecute(entry)) {
        frame.controls.appendChild(runButton(entry));
      }
      return frame.row;
    }

    // NsCheatsSubsystem.cpp:825 (BuildPickerWidget)
    function buildPickerWidget(entry) {
      var frame = rowFrame(entry);
      var picker = el("select", "ns-cheats-field ns-cheats-picker");
      picker.dataset.key = "picker:" + entry.id;
      picker.setAttribute("aria-label", entry.label);
      entry.options.forEach(function (option) {
        var item = el("option", "", option.label);
        item.value = option.value;
        picker.appendChild(item);
      });
      picker.addEventListener("change", function () {
        setValue(entry, picker.value, picker.value);
        refresh();
      });
      frame.controls.appendChild(picker);
      updaters.push(function () {
        var index = entry.options.findIndex(function (option) { return sameName(option.value, String(values[entry.variable])); });
        picker.selectedIndex = index >= 0 ? index : 0;
      });
      if (hasExecute(entry)) {
        frame.controls.appendChild(runButton(entry));
      }
      return frame.row;
    }

    // NsCheatsSubsystem.cpp:921 (BuildTextWidget). A commit sets the value but does not refresh the window.
    function buildTextWidget(entry) {
      var frame = rowFrame(entry);
      var field = el("input", "ns-cheats-field ns-cheats-text");
      field.type = "text";
      field.spellcheck = false;
      field.dataset.key = "text:" + entry.id;
      field.setAttribute("aria-label", entry.label);
      field.addEventListener("change", function () {
        setValue(entry, field.value, "\"" + field.value + "\"");
      });
      frame.controls.appendChild(field);
      updaters.push(function () {
        if (document.activeElement !== field) {
          field.value = entry.variable in values ? String(values[entry.variable]) : "";
        }
      });
      if (hasExecute(entry)) {
        frame.controls.appendChild(runButton(entry));
      }
      return frame.row;
    }

    // NsCheatsSubsystem.cpp:984 (BuildButtonRowWidget)
    function buildButtonRowWidget(entry) {
      var frame = rowFrame(entry);
      entry.actions.forEach(function (action) {
        var node = button("ns-cheats-button", action.label, "row:" + entry.id + ":" + action.id);
        node.addEventListener("click", function () {
          if (action.exec) {
            engineExec(action.exec);
          }
          if (action.log) {
            addLine("log", fill(action.log));
          }
          refresh();
        });
        frame.controls.appendChild(node);
      });
      return frame.row;
    }

    // NsCheatsSubsystem.cpp:643 (BuildEntriesPanel)
    function buildEntriesPanel() {
      var visible = getVisibleEntries();
      panelTitle.textContent = state.section ? state.tab + " / " + state.section : (state.tab || "None");
      panelCount.textContent = visible.length + " entries";
      rows.textContent = "";
      updaters = [];
      if (visible.length === 0) {
        rows.appendChild(el("div", "ns-cheats-row ns-cheats-empty", "No cheats match this tab, section, and search."));
      }
      visible.forEach(function (entry) {
        rows.appendChild(buildCheatEntryWidget(entry));
      });
    }

    // NsCheatsSubsystem.cpp:480 (BuildCheatUIContent). Keeps the focus on the same control after the rebuild.
    function rebuild() {
      var active = document.activeElement;
      var focusKey = active && win.contains(active) && active.dataset ? active.dataset.key : "";
      normalizeSelection();
      buildTabBar(getVisibleTabs());
      buildSectionList(getVisibleSectionsForTab(state.tab));
      buildEntriesPanel();
      refresh();
      if (focusKey) {
        var target = win.querySelector('[data-key="' + CSS.escape(focusKey) + '"]');
        if (target) {
          target.focus();
        }
      }
    }

    // After an action the plugin rebuilds the rows. The rows are the same, so the demo only reads the values again.
    function refresh() {
      updaters.forEach(function (update) { update(); });
    }

    // NsCheatsSubsystem.cpp:336 (OpenCheatUI), :360 (CloseCheatUI), :372 (ToggleCheatUI)
    function openCheatUI() {
      if (state.open) {
        addLine("note", "The window is open already. It comes to the front.");
        return;
      }
      var hadFocus = closed.contains(document.activeElement);
      state.open = true;
      win.hidden = false;
      closed.hidden = true;
      rebuild();
      if (hadFocus) {
        closeButton.focus();
      }
    }

    function closeCheatUI() {
      var hadFocus = win.contains(document.activeElement);
      state.open = false;
      win.hidden = true;
      closed.hidden = false;
      if (hadFocus) {
        openButton.focus();
      }
    }

    function toggleCheatUI() {
      if (state.open) {
        closeCheatUI();
      } else {
        openCheatUI();
      }
    }

    // NsCheatsSubsystem.cpp:1286 (RegisterConsoleCommands). Console names ignore case. Arguments split on white space.
    var commands = {
      "ns.cheats.open": function () { openCheatUI(); },
      "ns.cheats.close": function () { closeCheatUI(); },
      "ns.cheats.toggle": function () { toggleCheatUI(); },
      "ns.cheats.dump": function () { dumpRegisteredCheats(); },
      "ns.cheats.exec": function (args) {
        if (args.length === 0) {
          addLine("warn", "LogNsCheats: Warning: Usage: ns.Cheats.Exec <Command>");
          return;
        }
        engineExec(args.join(" "));
      }
    };

    function runCommand(line) {
      var words = line.trim().split(/\s+/).filter(Boolean);
      if (words.length === 0) {
        return;
      }
      addLine("input", "> " + line.trim());
      history.push(line.trim());
      historyIndex = history.length;
      var command = commands[words[0].toLowerCase()];
      if (command) {
        command(words.slice(1));
      } else {
        addLine("note", "This demo knows only the ns.Cheats commands: Open, Close, Toggle, Dump, and Exec.");
      }
    }

    commandInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        runCommand(commandInput.value);
        commandInput.value = "";
      } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        if (history.length === 0) {
          return;
        }
        event.preventDefault();
        historyIndex = Math.max(0, Math.min(history.length, historyIndex + (event.key === "ArrowUp" ? -1 : 1)));
        commandInput.value = history[historyIndex] || "";
      }
    });

    // Arrow keys move the focus in the tab bar and in the section list
    function arrowKeys(container, back, next) {
      container.addEventListener("keydown", function (event) {
        if (event.key !== back && event.key !== next) {
          return;
        }
        var buttons = Array.prototype.slice.call(container.querySelectorAll("button"));
        var index = buttons.indexOf(document.activeElement);
        if (index < 0) {
          return;
        }
        event.preventDefault();
        var target = buttons[(index + (event.key === next ? 1 : buttons.length - 1)) % buttons.length];
        target.focus();
      });
    }
    arrowKeys(tabBar, "ArrowLeft", "ArrowRight");
    arrowKeys(sectionList, "ArrowUp", "ArrowDown");

    search.addEventListener("input", function () {
      state.search = search.value;
      rebuild();
    });
    reload.addEventListener("click", rebuild);
    closeButton.addEventListener("click", closeCheatUI);
    openButton.addEventListener("click", function () {
      runCommand("ns.Cheats.Open");
    });

    fragmentEntries.forEach(registerEntry);
    rebuild();
    addLine("note", "Type a command and push Enter, or use a row of the window.");
  });
})();
