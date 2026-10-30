// NsUIFramework showcase: a screen stack on three layers.
// Open, close, Back, the choice of the active screen, and the input policy are ports of UNsUISubsystem.
(function () {
  if (!window.NsShowcase) {
    return;
  }

  // Source/NsUIFramework/Public/NsUIFrameworkTypes.h:11 (ENsUILayer, in enum order)
  var LAYERS = ["Game", "Menu", "Modal"];
  // Source/NsUIFramework/Public/NsUIFrameworkTypes.h:14 (ENsUIGameplayPolicy)
  var POLICIES = ["Automatic", "Allow", "Block"];
  // A limit of the demo only. The subsystem has no limit
  var MAX_SCREENS = 8;
  var MAX_LOG = 6;

  window.NsShowcase.register(".ns-uistack", function (root) {
    var list = root.querySelector("ul");
    var entries = list ? Array.prototype.slice.call(list.querySelectorAll("li")) : [];
    if (entries.length === 0) {
      throw new Error("no screens");
    }

    // The example screens of the fragment, with the defaults of FNsUIScreenConfig (NsUIFrameworkTypes.h:20)
    var examples = entries.map(function (entry) {
      var nameNode = entry.querySelector("b");
      var layer = LAYERS.indexOf(entry.dataset.layer);
      var gameplay = POLICIES.indexOf(entry.dataset.gameplay);
      return {
        name: (nameNode ? nameNode.textContent : entry.textContent).trim(),
        layer: layer === -1 ? 1 : layer,
        interactive: entry.dataset.interactive !== "false",
        gameplay: gameplay === -1 ? 0 : gameplay,
        start: entry.dataset.start === "true",
        opened: 0
      };
    });

    // Subsystem state
    var screens = [];
    var active = null;
    var policyOwner = null;
    var policyDirty = true;
    var input = { mode: "Game only", cursor: false, gameplay: true, reason: "no active screen" };
    var log = [];

    function addLog(text) {
      log.unshift(text);
      if (log.length > MAX_LOG) {
        log.length = MAX_LOG;
      }
    }

    // Source/NsUIFramework/Private/NsUISubsystem.cpp:399 (the gameplay rule of the input policy)
    function allowsGameplay(entry) {
      return entry.gameplay === 1 || (entry.gameplay === 0 && entry.layer === 0);
    }

    // Source/NsUIFramework/Private/NsUISubsystem.cpp:383
    function applyInputPolicy() {
      if (!policyDirty && policyOwner === active) {
        return;
      }
      policyDirty = false;
      policyOwner = active;
      if (!active) {
        input = { mode: "Game only", cursor: false, gameplay: true, reason: "no active screen" };
        return;
      }
      var reason = active.gameplay === 0 ? "Automatic on the " + LAYERS[active.layer] + " layer" : "Gameplay set to " + POLICIES[active.gameplay];
      if (allowsGameplay(active)) {
        input = { mode: "Game and UI", cursor: true, gameplay: true, reason: reason };
      } else {
        input = { mode: "UI only", cursor: true, gameplay: false, reason: reason };
      }
    }

    // Source/NsUIFramework/Private/NsUISubsystem.cpp:313
    // The demo screens are always visible and enabled
    function reconcile() {
      var next = null;
      screens.forEach(function (entry) {
        if (entry.interactive && (!next || entry.layer >= next.layer)) {
          next = entry;
        }
      });
      if (active !== next) {
        var previous = active;
        active = next;
        if (previous && screens.indexOf(previous) !== -1) {
          addLog("On Ns Screen Suspended: " + previous.name);
        }
        if (next) {
          addLog("On Ns Screen Activated: " + next.name + (next.activated ? " (resumed)" : ""));
          next.activated = true;
        }
        applyInputPolicy();
      }
    }

    // Source/NsUIFramework/Private/NsUISubsystem.cpp:170 (Open Screen) and :190 (Add Entry)
    function openScreen(example) {
      if (screens.length >= MAX_SCREENS) {
        return;
      }
      example.opened += 1;
      var entry = {
        name: example.name + (example.opened > 1 ? " " + example.opened : ""),
        layer: example.layer,
        interactive: example.interactive,
        gameplay: example.gameplay,
        activated: false
      };
      screens.push(entry);
      addLog("On Ns Screen Opened: " + entry.name);
      reconcile();
    }

    // Source/NsUIFramework/Private/NsUISubsystem.cpp:261 (Close Screen) and :296 (Remove Entry)
    function closeScreen(entry) {
      var index = screens.indexOf(entry);
      if (index === -1) {
        return;
      }
      screens.splice(index, 1);
      addLog("On Ns Screen Closed: " + entry.name);
      reconcile();
    }

    // Source/NsUIFramework/Private/NsUISubsystem.cpp:284
    function closeAll(layer) {
      screens.slice().forEach(function (entry) {
        if (entry.layer === layer) {
          closeScreen(entry);
        }
      });
    }

    // Source/NsUIFramework/Private/NsUISubsystem.cpp:659 (Route Action with Cancel)
    // The demo screens have no Cancel handler, and the default selection mode does not use Cancel
    function back() {
      if (!active) {
        addLog("Back: no active screen. The key goes to gameplay.");
        return;
      }
      addLog("Back: closes " + active.name);
      closeScreen(active);
    }

    // ---- View ----

    var view = document.createElement("div");
    view.className = "ns-uistack-view";

    var openBar = document.createElement("div");
    openBar.className = "ns-uistack-open";
    var openButtons = examples.map(function (example) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "ns-uistack-layer-" + LAYERS[example.layer].toLowerCase();
      button.textContent = example.name;
      var tag = document.createElement("span");
      tag.textContent = LAYERS[example.layer] + (example.interactive ? "" : ", passive") + (example.gameplay ? ", " + POLICIES[example.gameplay] : "");
      button.appendChild(tag);
      button.setAttribute("aria-label", "Open " + example.name + " on the " + LAYERS[example.layer] + " layer");
      button.addEventListener("click", function () {
        openScreen(example);
        render();
        keepFocus();
      });
      openBar.appendChild(button);
      return button;
    });

    var stack = document.createElement("div");
    stack.className = "ns-uistack-layers";
    // The layout draws Game first and Modal last, so Modal shows on top (NsUILayout.cpp:21)
    var rows = [];
    for (var layer = LAYERS.length - 1; layer >= 0; layer--) {
      var row = document.createElement("section");
      row.className = "ns-uistack-row";
      row.setAttribute("aria-label", LAYERS[layer] + " layer");
      var head = document.createElement("div");
      head.className = "ns-uistack-head";
      var title = document.createElement("span");
      title.textContent = LAYERS[layer];
      var clear = document.createElement("button");
      clear.type = "button";
      clear.textContent = "Close all";
      clear.setAttribute("aria-label", "Close all screens on the " + LAYERS[layer] + " layer");
      clear.addEventListener("click", closeAllHandler(layer));
      head.appendChild(title);
      head.appendChild(clear);
      var cards = document.createElement("ol");
      cards.className = "ns-uistack-cards";
      row.appendChild(head);
      row.appendChild(cards);
      stack.appendChild(row);
      rows[layer] = { cards: cards, clear: clear };
    }

    function closeAllHandler(layerIndex) {
      return function () {
        closeAll(layerIndex);
        render();
        keepFocus();
      };
    }

    var status = document.createElement("p");
    status.className = "ns-uistack-status";
    status.setAttribute("aria-live", "polite");

    var actions = document.createElement("div");
    actions.className = "ns-uistack-actions";
    var backButton = document.createElement("button");
    backButton.type = "button";
    backButton.textContent = "Back (Esc)";
    backButton.setAttribute("aria-label", "Back: close the active screen");
    backButton.addEventListener("click", function () {
      back();
      render();
    });
    var resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.textContent = "Reset";
    resetButton.setAttribute("aria-label", "Reset the screen stack");
    resetButton.addEventListener("click", function () {
      reset();
      render();
    });
    actions.appendChild(backButton);
    actions.appendChild(resetButton);

    var logList = document.createElement("ol");
    logList.className = "ns-uistack-log";
    logList.setAttribute("aria-label", "Screen events, newest first");

    view.appendChild(openBar);
    view.appendChild(stack);
    view.appendChild(status);
    view.appendChild(actions);
    var logTitle = document.createElement("p");
    logTitle.className = "ns-uistack-log-title";
    logTitle.textContent = "Events, newest first";
    view.appendChild(logTitle);
    view.appendChild(logList);
    root.insertBefore(view, list);

    // The state label of a screen, as the NsUI Inspector shows it (NsUISubsystem.cpp:711)
    function stateOf(entry) {
      if (entry === active) {
        return "Active";
      }
      return entry.interactive ? "Suspended" : "Passive";
    }

    function makeCard(entry) {
      var card = document.createElement("li");
      var state = stateOf(entry);
      card.className = "ns-uistack-card is-" + state.toLowerCase();
      var name = document.createElement("b");
      name.textContent = entry.name;
      var note = document.createElement("span");
      note.textContent = state === "Active" ? "Active: gets input" : state === "Suspended" ? "Suspended: shows, no clicks" : "Passive: shows, no input";
      var close = document.createElement("button");
      close.type = "button";
      close.textContent = "×";
      close.setAttribute("aria-label", "Close " + entry.name);
      close.addEventListener("click", function () {
        closeScreen(entry);
        render();
        keepFocus();
      });
      card.appendChild(name);
      card.appendChild(note);
      card.appendChild(close);
      return card;
    }

    // A removed or disabled button loses the focus. The focus then goes to Back, so Escape still works
    function keepFocus() {
      var focus = document.activeElement;
      if (!focus || !root.contains(focus) || focus.disabled) {
        backButton.focus();
      }
    }

    function render() {
      rows.forEach(function (row, layerIndex) {
        row.cards.textContent = "";
        var count = 0;
        // Open order from left to right, so the newest screen of a layer is the last card
        screens.forEach(function (entry) {
          if (entry.layer === layerIndex) {
            row.cards.appendChild(makeCard(entry));
            count++;
          }
        });
        if (count === 0) {
          var empty = document.createElement("li");
          empty.className = "ns-uistack-empty";
          empty.textContent = "No screen";
          row.cards.appendChild(empty);
        }
        row.clear.disabled = count === 0;
      });

      var who = active ? active.name + " on the " + LAYERS[active.layer] + " layer" : "no screen";
      status.textContent = "Input: " + who + ". Input mode: " + input.mode + ". Mouse cursor: " + (input.cursor ? "shown" : "hidden") +
        ". Gameplay input: " + (input.gameplay ? "on" : "off") + " (" + input.reason + ").";

      openButtons.forEach(function (button) {
        button.disabled = screens.length >= MAX_SCREENS;
      });
      backButton.disabled = false;

      logList.textContent = "";
      log.forEach(function (text) {
        var item = document.createElement("li");
        item.textContent = text;
        logList.appendChild(item);
      });
    }

    // The start screens open in list order, as the HUD does on Begin Play (Source/NsUIFramework/Private/NsUIHUD.cpp:7)
    function reset() {
      screens = [];
      active = null;
      policyOwner = null;
      policyDirty = true;
      log = [];
      examples.forEach(function (example) {
        example.opened = 0;
      });
      applyInputPolicy();
      examples.forEach(function (example) {
        if (example.start) {
          openScreen(example);
        }
      });
    }

    // Escape is a default Cancel key (Source/NsUIFramework/Private/NsUIDeveloperSettings.cpp:8)
    root.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        back();
        render();
      }
    });

    reset();
    render();
  });
})();
