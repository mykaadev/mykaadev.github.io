// Player Modeling article showcases. Each figure keeps plain HTML that reads well without this file.
//   .pm-story  branching story graph: pick a path from the start to an ending
//   .pm-dm     drama management: centralized, distributed, and mixed
//   .pm-loop   the player modeling loop: act, trace, model, and the drama manager answers
//   .pm-plane  player type plane: drag the marker, and the mix of types changes
//   .pm-flow   dynamic difficulty: skill against challenge, with and without adjustment
(function () {
  "use strict";

  if (!window.NsShowcase) {
    return;
  }

  var SVG_NS = "http://www.w3.org/2000/svg";
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function clamp(value, low, high) {
    return value < low ? low : (value > high ? high : value);
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  function svg(tag, attributes, parent) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attributes || {}).forEach(function (name) {
      node.setAttribute(name, attributes[name]);
    });
    if (parent) {
      parent.appendChild(node);
    }
    return node;
  }

  function svgText(text, attributes, parent) {
    var node = svg("text", attributes, parent);
    node.textContent = text;
    return node;
  }

  function makeButton(label, className) {
    var node = make("button", "pm-btn" + (className ? " " + className : ""), label);
    node.type = "button";
    return node;
  }

  // A row of buttons where one is pressed at a time
  function makeToggle(labelText, options, onPick) {
    var group = make("div", "pm-toggle");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", labelText);
    group.appendChild(make("span", "pm-toggle-label", labelText));
    var buttons = options.map(function (option) {
      var node = makeButton(option.label);
      node.setAttribute("aria-pressed", "false");
      node.addEventListener("click", function () {
        pick(option.value);
        onPick(option.value);
      });
      group.appendChild(node);
      return { node: node, value: option.value };
    });
    function pick(value) {
      buttons.forEach(function (button) {
        button.node.setAttribute("aria-pressed", button.value === value ? "true" : "false");
      });
    }
    return { node: group, pick: pick };
  }

  function arrowMarker(defs, id) {
    var marker = svg("marker", { id: id, viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, defs);
    svg("path", { d: "M0,0 L10,5 L0,10 z", "class": "pm-arrow-head" }, marker);
    return "url(#" + id + ")";
  }

  var uid = 0;
  function nextId(prefix) {
    uid += 1;
    return prefix + "-" + uid;
  }

  // ---------------------------------------------------------------------------
  // .pm-story: branching story graph
  // ---------------------------------------------------------------------------
  var STORY_NODES = {
    s: { x: 40, y: 130, beat: "Wake up in the village", kind: "start" },
    a: { x: 120, y: 130, beat: "A stranger begs for help" },
    b1: { x: 210, y: 70, beat: "Follow the stranger" },
    b2: { x: 210, y: 190, beat: "Report the stranger to the guard" },
    c1: { x: 300, y: 35, beat: "Explore the old ruins" },
    c2: { x: 300, y: 130, beat: "Get ambushed on the road" },
    c3: { x: 300, y: 225, beat: "Question the guard captain" },
    d1: { x: 395, y: 75, beat: "Find the hidden archive" },
    d2: { x: 395, y: 185, beat: "Track the bandits to their camp" },
    e1: { x: 500, y: 35, beat: "Ending: the scholar keeps the secret", kind: "end" },
    e2: { x: 500, y: 130, beat: "Ending: the mercenary sells the map", kind: "end" },
    e3: { x: 500, y: 225, beat: "Ending: the warden burns the camp", kind: "end" }
  };

  var STORY_EDGES = [
    ["s", "a"], ["a", "b1"], ["a", "b2"],
    ["b1", "c1"], ["b1", "c2"], ["b2", "c2"], ["b2", "c3"],
    ["c1", "d1"], ["c2", "d1"], ["c2", "d2"], ["c3", "d2"], ["c3", "e3"],
    ["d1", "e1"], ["d1", "e2"], ["d2", "e2"], ["d2", "e3"]
  ];

  function countStories(from) {
    var next = STORY_EDGES.filter(function (edge) {
      return edge[0] === from;
    });
    if (next.length === 0) {
      return 1;
    }
    return next.reduce(function (sum, edge) {
      return sum + countStories(edge[1]);
    }, 0);
  }

  window.NsShowcase.register(".pm-story", function (root) {
    var fallback = root.querySelector(".pm-fallback");
    if (fallback) {
      fallback.hidden = true;
    }

    var board = make("div", "pm-story-board");
    var graph = svg("svg", { viewBox: "0 0 540 260", "class": "pm-story-svg", role: "group", "aria-label": "Story graph" });
    board.appendChild(graph);
    var edgeLayer = svg("g", {}, graph);
    var nodeLayer = svg("g", {}, graph);

    var edges = {};
    STORY_EDGES.forEach(function (edge) {
      var from = STORY_NODES[edge[0]];
      var to = STORY_NODES[edge[1]];
      edges[edge[0] + ">" + edge[1]] = svg("line", { x1: from.x, y1: from.y, x2: to.x, y2: to.y, "class": "pm-story-edge" }, edgeLayer);
    });

    var nodes = {};
    Object.keys(STORY_NODES).forEach(function (key) {
      var data = STORY_NODES[key];
      var group = svg("g", { "class": "pm-story-node", transform: "translate(" + data.x + " " + data.y + ")", "aria-label": data.beat }, nodeLayer);
      if (data.kind === "start") {
        svg("rect", { x: "-10", y: "-10", width: "20", height: "20", rx: "2" }, group);
      } else if (data.kind === "end") {
        svg("path", { d: "M0,-13 L12,9 L-12,9 z" }, group);
      } else {
        svg("circle", { r: "11" }, group);
      }
      var title = svg("title", {}, group);
      title.textContent = data.beat;
      group.addEventListener("mouseenter", function () {
        hint.textContent = data.beat;
      });
      group.addEventListener("mouseleave", function () {
        hint.textContent = "";
      });
      group.addEventListener("click", function () {
        choose(key);
      });
      group.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          choose(key);
        }
      });
      nodes[key] = group;
    });

    var side = make("div", "pm-story-side");
    var status = make("p", "pm-readout");
    status.setAttribute("aria-live", "polite");
    var hint = make("p", "pm-hint");
    var trail = make("ol", "pm-story-trail");
    var reset = makeButton("Start again");
    var seenText = make("p", "pm-hint");
    side.appendChild(status);
    side.appendChild(trail);
    side.appendChild(reset);
    side.appendChild(seenText);
    board.appendChild(side);
    root.appendChild(board);
    root.appendChild(hint);

    var total = countStories("s");
    var path = [];
    var seen = {};

    function choices() {
      var current = path[path.length - 1];
      return STORY_EDGES.filter(function (edge) {
        return edge[0] === current;
      }).map(function (edge) {
        return edge[1];
      });
    }

    function render() {
      var options = choices();
      Object.keys(nodes).forEach(function (key) {
        var node = nodes[key];
        var onPath = path.indexOf(key) !== -1;
        var isChoice = options.indexOf(key) !== -1;
        node.classList.toggle("is-path", onPath);
        node.classList.toggle("is-choice", isChoice);
        if (isChoice) {
          node.setAttribute("tabindex", "0");
          node.setAttribute("role", "button");
        } else {
          node.removeAttribute("tabindex");
          node.removeAttribute("role");
        }
      });
      Object.keys(edges).forEach(function (id) {
        var parts = id.split(">");
        var index = path.indexOf(parts[0]);
        edges[id].classList.toggle("is-path", index !== -1 && path[index + 1] === parts[1]);
        edges[id].classList.toggle("is-choice", parts[0] === path[path.length - 1]);
      });

      trail.textContent = "";
      path.forEach(function (key) {
        trail.appendChild(make("li", null, STORY_NODES[key].beat));
      });

      var last = STORY_NODES[path[path.length - 1]];
      if (last.kind === "end") {
        seen[path[path.length - 1]] = true;
        status.textContent = "You reached an ending after " + (path.length - 2) + " choices.";
      } else {
        status.textContent = "Pick one of the highlighted nodes. " + options.length + " paths lead on from here.";
      }
      seenText.textContent = "Endings seen: " + Object.keys(seen).length + " of 3. This small graph already holds " + total + " different stories.";
    }

    function choose(key) {
      if (choices().indexOf(key) === -1) {
        return;
      }
      path.push(key);
      render();
      var next = choices();
      if (next.length > 0 && document.activeElement && document.activeElement.closest && document.activeElement.closest(".pm-story-svg")) {
        nodes[next[0]].focus();
      }
    }

    reset.addEventListener("click", function () {
      path = ["s", "a"];
      render();
    });

    path = ["s", "a"];
    render();
  });

  // ---------------------------------------------------------------------------
  // .pm-dm: three kinds of drama management
  // ---------------------------------------------------------------------------
  var DM_CONTROL = { central: 90, distributed: 10, mixed: 55 };

  window.NsShowcase.register(".pm-dm", function (root) {
    var modes = Array.prototype.map.call(root.querySelectorAll("li[data-mode]"), function (item) {
      var name = item.querySelector("b");
      return {
        value: item.getAttribute("data-mode"),
        label: name ? name.textContent : item.getAttribute("data-mode"),
        text: (name ? item.textContent.replace(name.textContent, "") : item.textContent).trim()
      };
    });
    if (modes.length === 0) {
      throw new Error("no modes");
    }
    var list = root.querySelector("ul");
    if (list) {
      list.hidden = true;
    }

    var id = nextId("pm-dm-arrow");
    var board = make("div", "pm-dm-board");
    var scene = svg("svg", { viewBox: "0 0 460 250", "class": "pm-dm-svg", "aria-hidden": "true", focusable: "false" });
    board.appendChild(scene);
    var defs = svg("defs", {}, scene);
    var arrow = arrowMarker(defs, id);

    var player = { x: 60, y: 160 };
    var dm = { x: 250, y: 40 };
    var agents = [{ x: 200, y: 170, name: "Smith" }, { x: 300, y: 215, name: "Guard" }, { x: 385, y: 140, name: "Thief" }];

    var lines = svg("g", {}, scene);
    function edge(from, to, className, bend) {
      var mx = (from.x + to.x) / 2 + (bend || 0);
      var my = (from.y + to.y) / 2 - (bend || 0);
      return svg("path", { d: "M" + from.x + "," + from.y + " Q" + mx + "," + my + " " + to.x + "," + to.y, "class": "pm-dm-edge " + className, "marker-end": arrow }, lines);
    }
    // Shorter end points, so the arrows stop at the edge of each shape
    function toward(from, to, distance) {
      var dx = to.x - from.x;
      var dy = to.y - from.y;
      var length = Math.sqrt(dx * dx + dy * dy) || 1;
      return { x: from.x + dx / length * distance, y: from.y + dy / length * distance };
    }
    agents.forEach(function (agent) {
      edge(toward(dm, agent, 26), toward(agent, dm, 22), "e-control");
      edge(toward(agent, player, 22), toward(player, agent, 30), "e-play", 0);
    });
    edge(toward(agents[0], agents[1], 22), toward(agents[1], agents[0], 22), "e-social", 14);
    edge(toward(agents[1], agents[2], 22), toward(agents[2], agents[1], 22), "e-social", 14);
    edge(toward(agents[2], agents[0], 22), toward(agents[0], agents[2], 22), "e-social", -10);
    edge(toward(player, dm, 30), toward(dm, player, 30), "e-observe", -20);

    var dmGroup = svg("g", { "class": "pm-dm-director", transform: "translate(" + dm.x + " " + dm.y + ")" }, scene);
    svg("rect", { x: "-58", y: "-20", width: "116", height: "40", rx: "6" }, dmGroup);
    svgText("Drama Manager", { y: "5", "text-anchor": "middle" }, dmGroup);

    var playerGroup = svg("g", { "class": "pm-dm-player", transform: "translate(" + player.x + " " + player.y + ")" }, scene);
    svg("circle", { r: "26" }, playerGroup);
    svgText("Player", { y: "5", "text-anchor": "middle" }, playerGroup);

    agents.forEach(function (agent) {
      var group = svg("g", { "class": "pm-dm-agent", transform: "translate(" + agent.x + " " + agent.y + ")" }, scene);
      svg("circle", { r: "20" }, group);
      svgText(agent.name, { y: "4", "text-anchor": "middle" }, group);
    });

    var side = make("div", "pm-dm-side");
    var toggle = makeToggle("Drama management", modes, show);
    side.appendChild(toggle.node);
    var text = make("p", "pm-dm-text");
    text.setAttribute("aria-live", "polite");
    side.appendChild(text);

    var meter = make("div", "pm-meter");
    var meterTop = make("div", "pm-meter-labels");
    var authorLabel = make("span", null, "Author control");
    var agentLabel = make("span", null, "Agent freedom");
    meterTop.appendChild(authorLabel);
    meterTop.appendChild(agentLabel);
    var meterBar = make("div", "pm-meter-bar");
    var meterFill = make("span");
    meterBar.appendChild(meterFill);
    meter.appendChild(meterTop);
    meter.appendChild(meterBar);
    side.appendChild(meter);

    var legend = make("ul", "pm-dm-legend");
    [["e-control", "The drama manager directs an agent"], ["e-social", "Agents act on each other"], ["e-play", "Agents react to the player"], ["e-observe", "The drama manager watches or nudges the player"]].forEach(function (row) {
      var item = make("li", row[0]);
      item.appendChild(make("i"));
      item.appendChild(document.createTextNode(row[1]));
      legend.appendChild(item);
    });
    side.appendChild(legend);
    board.appendChild(side);
    root.appendChild(board);

    function show(value) {
      root.setAttribute("data-mode", value);
      toggle.pick(value);
      modes.forEach(function (mode) {
        if (mode.value === value) {
          text.textContent = mode.text;
        }
      });
      var control = DM_CONTROL[value] !== undefined ? DM_CONTROL[value] : 50;
      meterFill.style.width = control + "%";
      authorLabel.textContent = "Author control " + control + "%";
      agentLabel.textContent = "Agent freedom " + (100 - control) + "%";
    }

    show(root.getAttribute("data-start") || modes[0].value);
  });

  // ---------------------------------------------------------------------------
  // .pm-loop: the player modeling loop
  // ---------------------------------------------------------------------------
  var TRAITS = ["Explorer", "Killer", "Achiever", "Socializer"];

  var LOOP_ACTIONS = [
    { label: "Explore the ruins", weights: { Explorer: 1, Achiever: 0.2 } },
    { label: "Raid a bandit camp", weights: { Killer: 1, Achiever: 0.3 } },
    { label: "Chat with the innkeeper", weights: { Socializer: 1 } },
    { label: "Finish a bounty board", weights: { Achiever: 1, Killer: 0.3 } },
    { label: "Climb to a hidden peak", weights: { Explorer: 0.8, Achiever: 0.3 } },
    { label: "Duel a rival in town", weights: { Killer: 0.8, Socializer: 0.3 } },
    { label: "Walk a lost child home", weights: { Socializer: 0.8, Explorer: 0.2 } },
    { label: "Collect every rare herb", weights: { Achiever: 0.9, Explorer: 0.3 } }
  ];

  // The answer of the drama manager for each top trait: a quest structure (Dickey) and an NPC motivation (Doran and Parberry)
  var LOOP_QUESTS = {
    Explorer: { quest: "A cartographer wants the lost shrine on her map.", kind: "Place-oriented quest. NPC motivation: knowledge." },
    Killer: { quest: "The captain posts a bounty on the bridge troll.", kind: "Bounty quest. NPC motivation: protection." },
    Achiever: { quest: "The smith needs five star-iron ingots for a legendary blade.", kind: "Collection quest. NPC motivation: equipment." },
    Socializer: { quest: "Two families ask you to settle an old feud.", kind: "Goodwill quest. NPC motivation: reputation." }
  };

  var LOOP_DECAY = 0.8;

  window.NsShowcase.register(".pm-loop", function (root) {
    var fallback = root.querySelector(".pm-fallback");
    if (fallback) {
      fallback.hidden = true;
    }

    var arrowId = nextId("pm-loop-arrow");
    var diagram = svg("svg", { viewBox: "0 0 560 300", "class": "pm-loop-svg", "aria-hidden": "true", focusable: "false" });
    var defs = svg("defs", {}, diagram);
    var arrow = arrowMarker(defs, arrowId);
    var stages = {};

    function stage(name, element) {
      element.classList.add("pm-loop-part");
      (stages[name] = stages[name] || []).push(element);
      return element;
    }

    function box(name, x, y, w, h, label, small) {
      var group = stage(name, svg("g", { "class": "pm-loop-box" + (small ? " is-small" : "") }, diagram));
      svg("rect", { x: x, y: y, width: w, height: h, rx: small ? "8" : "4" }, group);
      var lines = label.split("\n");
      lines.forEach(function (line, index) {
        svgText(line, { x: x + w / 2, y: y + h / 2 + 5 + (index - (lines.length - 1) / 2) * 16, "text-anchor": "middle" }, group);
      });
      return group;
    }

    function link(name, points, both) {
      var attributes = { points: points, "class": "pm-loop-link", "marker-end": arrow };
      if (both) {
        attributes["marker-start"] = arrow;
      }
      return stage(name, svg("polyline", attributes, diagram));
    }

    // Links first, so the boxes draw over them
    link("act", "78,95 108,95", true);
    link("trace", "232,95 263,95");
    link("model-in", "357,95 393,95");
    link("model-out", "460,127 460,158");
    link("model-dm", "460,196 460,223");
    link("dm-out", "393,250 370,250 370,190 357,190");
    link("dm-out2", "265,167 200,167 200,129");
    link("state", "170,129 170,158", true);
    link("state-dm", "242,262 393,262");

    var player = stage("act", svg("g", { "class": "pm-loop-box is-player" }, diagram));
    svg("circle", { cx: "45", cy: "95", r: "28" }, player);
    svg("circle", { cx: "36", cy: "88", r: "3", "class": "pm-loop-eye" }, player);
    svg("circle", { cx: "54", cy: "88", r: "3", "class": "pm-loop-eye" }, player);
    svg("path", { d: "M34,104 Q45,113 56,104", "class": "pm-loop-mouth" }, player);
    svgText("Player", { x: "45", y: "143", "text-anchor": "middle" }, player);

    box("engine", 110, 65, 120, 62, "Game\nEngine");
    box("trace", 265, 78, 90, 34, "Player Trace", true);
    box("modeling", 395, 65, 130, 62, "Player\nModeling");
    box("model", 420, 160, 80, 34, "Player Model", true);
    box("dm", 395, 225, 130, 62, "Drama\nManager");
    box("dm-out", 265, 173, 90, 34, "DM Actions", true);

    var state = stage("state", svg("g", { "class": "pm-loop-box is-state" }, diagram));
    svg("rect", { x: "100", y: "160", width: "140", height: "128", rx: "10" }, state);
    [["Physical", 110, 172], ["Story", 175, 172]].forEach(function (part) {
      svg("rect", { x: part[1], y: part[2], width: "55", height: "30", rx: "6", "class": "pm-loop-sub" }, state);
      svgText(part[0], { x: part[1] + 27.5, y: part[2] + 19, "text-anchor": "middle", "class": "pm-loop-subtext" }, state);
    });
    svg("rect", { x: "137", y: "212", width: "66", height: "30", rx: "6", "class": "pm-loop-sub" }, state);
    svgText("History", { x: "170", y: "231", "text-anchor": "middle", "class": "pm-loop-subtext" }, state);
    svgText("Game State", { x: "170", y: "275", "text-anchor": "middle" }, state);

    var panel = make("div", "pm-loop-panel");

    var actionsBox = make("div", "pm-loop-actions");
    actionsBox.appendChild(make("h4", null, "1. Play"));
    var actionGrid = make("div", "pm-loop-buttons");
    LOOP_ACTIONS.forEach(function (action) {
      var node = makeButton(action.label);
      node.addEventListener("click", function () {
        act(action);
      });
      actionGrid.appendChild(node);
    });
    actionsBox.appendChild(actionGrid);
    var reset = makeButton("Forget everything", "pm-btn-quiet");
    actionsBox.appendChild(reset);

    var modelBox = make("div", "pm-loop-model");
    modelBox.appendChild(make("h4", null, "2. Player model"));
    var bars = {};
    TRAITS.forEach(function (trait) {
      var row = make("div", "pm-bar-row");
      row.appendChild(make("span", "pm-bar-name", trait));
      var bar = make("span", "pm-bar");
      var fill = make("span");
      bar.appendChild(fill);
      row.appendChild(bar);
      var value = make("span", "pm-bar-value", "0%");
      row.appendChild(value);
      modelBox.appendChild(row);
      bars[trait] = { row: row, fill: fill, value: value };
    });
    modelBox.appendChild(make("h4", "pm-loop-sub-head", "Recent history"));
    var history = make("ol", "pm-loop-history");
    modelBox.appendChild(history);

    var dmBox = make("div", "pm-loop-dm");
    dmBox.appendChild(make("h4", null, "3. Drama manager"));
    var quest = make("p", "pm-loop-quest");
    quest.setAttribute("aria-live", "polite");
    var questKind = make("p", "pm-hint");
    var why = make("p", "pm-hint");
    dmBox.appendChild(quest);
    dmBox.appendChild(questKind);
    dmBox.appendChild(why);

    panel.appendChild(actionsBox);
    panel.appendChild(modelBox);
    panel.appendChild(dmBox);

    root.appendChild(diagram);
    root.appendChild(panel);

    var scores = {};
    var log = [];
    var timers = [];

    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }

    // Light up the parts of the diagram in the order the data moves
    var ORDER = [["act"], ["engine"], ["trace"], ["model-in", "modeling"], ["model-out", "model"], ["model-dm", "state", "state-dm", "dm"], ["dm-out", "dm-out2"], ["engine"]];

    function pulse() {
      clearTimers();
      Object.keys(stages).forEach(function (name) {
        stages[name].forEach(function (element) {
          element.classList.remove("is-lit");
        });
      });
      var step = reduceMotion ? 0 : 160;
      ORDER.forEach(function (names, index) {
        timers.push(setTimeout(function () {
          names.forEach(function (name) {
            (stages[name] || []).forEach(function (element) {
              element.classList.add("is-lit");
            });
          });
        }, index * step));
      });
      timers.push(setTimeout(function () {
        Object.keys(stages).forEach(function (name) {
          stages[name].forEach(function (element) {
            element.classList.remove("is-lit");
          });
        });
      }, ORDER.length * step + 900));
    }

    function shares() {
      var total = 0;
      TRAITS.forEach(function (trait) {
        total += scores[trait] || 0;
      });
      var result = {};
      TRAITS.forEach(function (trait) {
        result[trait] = total > 0 ? (scores[trait] || 0) / total : 0;
      });
      return result;
    }

    function render() {
      var share = shares();
      var top = null;
      TRAITS.forEach(function (trait) {
        if (top === null || share[trait] > share[top]) {
          top = trait;
        }
      });
      TRAITS.forEach(function (trait) {
        bars[trait].fill.style.width = (share[trait] * 100).toFixed(1) + "%";
        bars[trait].value.textContent = Math.round(share[trait] * 100) + "%";
        bars[trait].row.classList.toggle("is-top", log.length > 0 && trait === top);
      });

      history.textContent = "";
      log.slice(-4).forEach(function (entry) {
        history.appendChild(make("li", null, entry));
      });
      if (log.length === 0) {
        history.appendChild(make("li", "pm-hint", "Nothing yet."));
      }

      if (log.length === 0) {
        quest.textContent = "No data yet. The drama manager offers the default main quest.";
        questKind.textContent = "";
        why.textContent = "Play a few actions, and watch the model take shape.";
      } else if (log.length < 3 || share[top] < 0.4) {
        quest.textContent = "Not sure yet. A notice board with a bit of everything.";
        questKind.textContent = "Mixed offer. The model needs more evidence.";
        why.textContent = "Top trait: " + top + " at " + Math.round(share[top] * 100) + "%. That is too close to call.";
      } else {
        quest.textContent = LOOP_QUESTS[top].quest;
        questKind.textContent = LOOP_QUESTS[top].kind;
        why.textContent = "Top trait: " + top + " at " + Math.round(share[top] * 100) + "%. Older actions fade, so the model follows you if you change.";
      }
    }

    function act(action) {
      TRAITS.forEach(function (trait) {
        scores[trait] = (scores[trait] || 0) * LOOP_DECAY + (action.weights[trait] || 0);
      });
      log.push(action.label);
      pulse();
      render();
    }

    reset.addEventListener("click", function () {
      scores = {};
      log = [];
      render();
    });

    function resize() {
      root.classList.toggle("pm-loop-wide", root.clientWidth >= 720);
    }
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(root);
    } else {
      window.addEventListener("resize", resize);
    }
    resize();
    render();
  });

  // ---------------------------------------------------------------------------
  // .pm-plane: player types on a plane
  // ---------------------------------------------------------------------------
  var PLANE_SIZE = 300;
  var PLANE_PAD = 34;

  window.NsShowcase.register(".pm-plane", function (root) {
    var list = root.querySelector("ul");
    var types = Array.prototype.map.call(root.querySelectorAll("li[data-x]"), function (item) {
      var name = item.querySelector("b");
      return {
        x: Number(item.getAttribute("data-x")),
        y: Number(item.getAttribute("data-y")),
        name: name ? name.textContent : "",
        text: (name ? item.textContent.replace(name.textContent, "") : item.textContent).trim()
      };
    });
    if (types.length === 0) {
      throw new Error("no types");
    }
    if (list) {
      list.hidden = true;
    }

    var inner = PLANE_SIZE - 2 * PLANE_PAD;
    function px(x) {
      return PLANE_PAD + (x + 1) / 2 * inner;
    }
    function py(y) {
      return PLANE_PAD + (1 - (y + 1) / 2) * inner;
    }

    var board = make("div", "pm-plane-board");
    var plane = svg("svg", { viewBox: "0 0 " + PLANE_SIZE + " " + PLANE_SIZE, "class": "pm-plane-svg", role: "group", "aria-label": "Player type plane" });
    board.appendChild(plane);
    svg("rect", { x: PLANE_PAD, y: PLANE_PAD, width: inner, height: inner, rx: "6", "class": "pm-plane-back" }, plane);
    svg("line", { x1: px(-1), y1: py(0), x2: px(1), y2: py(0), "class": "pm-plane-axis" }, plane);
    svg("line", { x1: px(0), y1: py(-1), x2: px(0), y2: py(1), "class": "pm-plane-axis" }, plane);

    var labels = [
      [root.getAttribute("data-y-high"), PLANE_SIZE / 2, PLANE_PAD - 10, "middle"],
      [root.getAttribute("data-y-low"), PLANE_SIZE / 2, PLANE_SIZE - PLANE_PAD + 20, "middle"],
      [root.getAttribute("data-x-low"), PLANE_PAD - 4, PLANE_SIZE / 2 - 8, "start"],
      [root.getAttribute("data-x-high"), PLANE_SIZE - PLANE_PAD + 4, PLANE_SIZE / 2 - 8, "end"]
    ];
    labels.forEach(function (label) {
      if (label[0]) {
        svgText(label[0], { x: label[1], y: label[2], "text-anchor": label[3], "class": "pm-plane-axis-label" }, plane);
      }
    });
    if (root.getAttribute("data-center")) {
      svgText(root.getAttribute("data-center"), { x: px(0) + 6, y: py(0) + 14, "class": "pm-plane-axis-label" }, plane);
    }

    var anchors = types.map(function (type) {
      var group = svg("g", { "class": "pm-plane-type", transform: "translate(" + px(type.x) + " " + py(type.y) + ")" }, plane);
      svg("circle", { r: "5" }, group);
      svgText(type.name, { y: "-10", "text-anchor": "middle" }, group);
      return group;
    });

    var marker = svg("g", { "class": "pm-plane-marker", tabindex: "0", role: "slider", "aria-label": "Your player. Use the arrow keys to move." }, plane);
    svg("circle", { r: "18", "class": "pm-plane-halo" }, marker);
    svg("circle", { r: "8" }, marker);

    var side = make("div", "pm-plane-side");
    var readout = make("p", "pm-readout");
    readout.setAttribute("aria-live", "polite");
    var description = make("p", "pm-plane-text");
    side.appendChild(readout);
    side.appendChild(description);
    var rows = types.map(function (type) {
      var row = make("div", "pm-bar-row");
      row.appendChild(make("span", "pm-bar-name", type.name));
      var bar = make("span", "pm-bar");
      var fill = make("span");
      bar.appendChild(fill);
      row.appendChild(bar);
      var value = make("span", "pm-bar-value");
      row.appendChild(value);
      side.appendChild(row);
      return { row: row, fill: fill, value: value };
    });
    side.appendChild(make("p", "pm-hint", "Drag the pink dot, or focus it and use the arrow keys. Real players are a mix, not one box."));
    board.appendChild(side);
    root.appendChild(board);

    var start = String(root.getAttribute("data-start") || "0.3,0.3").split(",");
    var point = { x: clamp(Number(start[0]) || 0, -1, 1), y: clamp(Number(start[1]) || 0, -1, 1) };

    // Inverse square distance: the closer the marker, the larger the share of that type
    function weights() {
      var raw = types.map(function (type) {
        var dx = type.x - point.x;
        var dy = type.y - point.y;
        return 1 / (dx * dx + dy * dy + 0.06);
      });
      var total = raw.reduce(function (sum, value) {
        return sum + value;
      }, 0);
      return raw.map(function (value) {
        return value / total;
      });
    }

    function render() {
      marker.setAttribute("transform", "translate(" + px(point.x).toFixed(1) + " " + py(point.y).toFixed(1) + ")");
      marker.setAttribute("aria-valuetext", "x " + point.x.toFixed(2) + ", y " + point.y.toFixed(2));
      var share = weights();
      var top = 0;
      share.forEach(function (value, index) {
        if (value > share[top]) {
          top = index;
        }
      });
      rows.forEach(function (row, index) {
        row.fill.style.width = (share[index] * 100).toFixed(1) + "%";
        row.value.textContent = Math.round(share[index] * 100) + "%";
        row.row.classList.toggle("is-top", index === top);
        anchors[index].classList.toggle("is-top", index === top);
      });
      var text = "Mostly " + types[top].name + " (" + Math.round(share[top] * 100) + "%)";
      if (readout.textContent !== text) {
        readout.textContent = text;
      }
      description.textContent = types[top].text;
    }

    function fromEvent(event) {
      var box = plane.getBoundingClientRect();
      var scale = PLANE_SIZE / box.width;
      var x = (event.clientX - box.left) * scale;
      var y = (event.clientY - box.top) * scale;
      point.x = clamp((x - PLANE_PAD) / inner * 2 - 1, -1, 1);
      point.y = clamp(1 - (y - PLANE_PAD) / inner * 2, -1, 1);
      render();
    }

    var dragging = false;
    plane.addEventListener("pointerdown", function (event) {
      dragging = true;
      if (plane.setPointerCapture) {
        plane.setPointerCapture(event.pointerId);
      }
      fromEvent(event);
      event.preventDefault();
    });
    plane.addEventListener("pointermove", function (event) {
      if (dragging) {
        fromEvent(event);
      }
    });
    function stop() {
      dragging = false;
    }
    plane.addEventListener("pointerup", stop);
    plane.addEventListener("pointercancel", stop);

    marker.addEventListener("keydown", function (event) {
      var step = event.shiftKey ? 0.25 : 0.08;
      var moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      var move = moves[event.key];
      if (!move) {
        return;
      }
      event.preventDefault();
      point.x = clamp(point.x + move[0], -1, 1);
      point.y = clamp(point.y + move[1], -1, 1);
      render();
    });

    render();
  });

  // ---------------------------------------------------------------------------
  // .pm-flow: dynamic difficulty adjustment and the flow channel
  // ---------------------------------------------------------------------------
  var FLOW_SIZE = 300;
  var FLOW_LEFT = 40;
  var FLOW_BOTTOM = 262;
  var FLOW_SPAN = 240;
  var FLOW_BAND = 0.12;
  var FLOW_STEPS = 120;
  var FLOW_TIME = 4200;

  var LEARNERS = {
    slow: { rate: 0.45, phase: 0.3 },
    average: { rate: 0.7, phase: 1.7 },
    fast: { rate: 0.98, phase: 2.9 }
  };

  function easeOut(t) {
    return 1 - (1 - t) * (1 - t);
  }

  // One run of the game: the skill of the player over time, and the challenge the game gives
  function simulate(learner, adaptive) {
    var points = [];
    var challenge = 0.14;
    for (var i = 0; i <= FLOW_STEPS; i++) {
      var t = i / FLOW_STEPS;
      var skill = clamp(0.08 + learner.rate * easeOut(t) + 0.018 * Math.sin(t * 19 + learner.phase), 0, 1);
      if (adaptive) {
        // The game reads performance with a lag, and aims a little above the skill
        challenge += (skill + 0.04 - challenge) * 0.12;
      } else {
        // A fixed curve, tuned for the average player
        challenge = 0.14 + 0.68 * easeOut(t);
      }
      points.push({ skill: skill, challenge: clamp(challenge, 0, 1) });
    }
    return points;
  }

  function zone(point) {
    var gap = point.challenge - point.skill;
    if (gap > FLOW_BAND) {
      return "Anxiety";
    }
    if (gap < -FLOW_BAND) {
      return "Boredom";
    }
    return "Flow";
  }

  window.NsShowcase.register(".pm-flow", function (root) {
    var fallback = root.querySelector(".pm-fallback");
    if (fallback) {
      fallback.hidden = true;
    }

    function fx(value) {
      return FLOW_LEFT + value * FLOW_SPAN;
    }
    function fy(value) {
      return FLOW_BOTTOM - value * FLOW_SPAN;
    }

    var board = make("div", "pm-flow-board");
    var chart = svg("svg", { viewBox: "0 0 " + FLOW_SIZE + " " + (FLOW_SIZE - 6), "class": "pm-flow-svg", "aria-hidden": "true", focusable: "false" });
    board.appendChild(chart);

    svg("rect", { x: fx(0), y: fy(1), width: FLOW_SPAN, height: FLOW_SPAN, "class": "pm-flow-back" }, chart);
    svg("polygon", { points: [fx(0) + "," + fy(FLOW_BAND), fx(1 - FLOW_BAND) + "," + fy(1), fx(0) + "," + fy(1)].join(" "), "class": "pm-flow-anxiety" }, chart);
    svg("polygon", { points: [fx(FLOW_BAND) + "," + fy(0), fx(1) + "," + fy(0), fx(1) + "," + fy(1 - FLOW_BAND)].join(" "), "class": "pm-flow-boredom" }, chart);
    svg("polygon", { points: [fx(0) + "," + fy(0), fx(FLOW_BAND) + "," + fy(0), fx(1) + "," + fy(1 - FLOW_BAND), fx(1) + "," + fy(1), fx(1 - FLOW_BAND) + "," + fy(1), fx(0) + "," + fy(FLOW_BAND)].join(" "), "class": "pm-flow-band" }, chart);
    svgText("Anxiety", { x: fx(0.2), y: fy(0.8), "class": "pm-flow-zone" }, chart);
    svgText("Flow", { x: fx(0.6), y: fy(0.57), "class": "pm-flow-zone is-flow", transform: "rotate(-45 " + fx(0.6) + " " + fy(0.57) + ")" }, chart);
    svgText("Boredom", { x: fx(0.62), y: fy(0.18), "class": "pm-flow-zone" }, chart);
    svgText("Skill", { x: fx(1), y: FLOW_BOTTOM + 18, "text-anchor": "end", "class": "pm-flow-axis" }, chart);
    svgText("Challenge", { x: 0, y: 0, "text-anchor": "end", "class": "pm-flow-axis", transform: "translate(" + (FLOW_LEFT - 10) + " " + fy(1) + ") rotate(-90)" }, chart);

    var trail = svg("polyline", { "class": "pm-flow-trail", points: "" }, chart);
    var dot = svg("circle", { r: "6", "class": "pm-flow-dot", cx: fx(0), cy: fy(0) }, chart);

    var side = make("div", "pm-flow-side");
    var settings = { learner: "average", adaptive: false };
    var learnerToggle = makeToggle("Player", [{ label: "Slow learner", value: "slow" }, { label: "Average", value: "average" }, { label: "Fast learner", value: "fast" }], function (value) {
      settings.learner = value;
      play();
    });
    var ddaToggle = makeToggle("Difficulty", [{ label: "Fixed curve", value: false }, { label: "Adaptive (DDA)", value: true }], function (value) {
      settings.adaptive = value;
      play();
    });
    side.appendChild(learnerToggle.node);
    side.appendChild(ddaToggle.node);
    var replay = makeButton("Play again");
    side.appendChild(replay);
    var readout = make("p", "pm-readout");
    readout.setAttribute("aria-live", "polite");
    side.appendChild(readout);
    var splits = make("div", "pm-flow-splits");
    var splitRows = {};
    ["Flow", "Anxiety", "Boredom"].forEach(function (name) {
      var row = make("div", "pm-bar-row is-" + name.toLowerCase());
      row.appendChild(make("span", "pm-bar-name", name));
      var bar = make("span", "pm-bar");
      var fill = make("span");
      bar.appendChild(fill);
      row.appendChild(bar);
      var value = make("span", "pm-bar-value", "0%");
      row.appendChild(value);
      splits.appendChild(row);
      splitRows[name] = { fill: fill, value: value };
    });
    side.appendChild(splits);
    side.appendChild(make("p", "pm-hint", "The fixed curve fits the average player. Try the other two, then switch on DDA."));
    board.appendChild(side);
    root.appendChild(board);

    var frame = 0;

    function draw(points, count) {
      var shown = points.slice(0, count + 1);
      trail.setAttribute("points", shown.map(function (point) {
        return fx(point.skill).toFixed(1) + "," + fy(point.challenge).toFixed(1);
      }).join(" "));
      var last = shown[shown.length - 1];
      dot.setAttribute("cx", fx(last.skill).toFixed(1));
      dot.setAttribute("cy", fy(last.challenge).toFixed(1));
      var current = zone(last);
      dot.setAttribute("class", "pm-flow-dot is-" + current.toLowerCase());

      var counts = { Flow: 0, Anxiety: 0, Boredom: 0 };
      shown.forEach(function (point) {
        counts[zone(point)] += 1;
      });
      Object.keys(counts).forEach(function (name) {
        var share = counts[name] / shown.length;
        splitRows[name].fill.style.width = (share * 100).toFixed(1) + "%";
        splitRows[name].value.textContent = Math.round(share * 100) + "%";
      });
      readout.textContent = count >= FLOW_STEPS ? "Run done. " + Math.round(counts.Flow / shown.length * 100) + "% of the time in flow." : "Right now: " + current;
    }

    function play() {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      var points = simulate(LEARNERS[settings.learner], settings.adaptive);
      if (reduceMotion) {
        draw(points, FLOW_STEPS);
        return;
      }
      var begin = null;
      function tick(now) {
        if (begin === null) {
          begin = now;
        }
        var count = Math.min(FLOW_STEPS, Math.floor((now - begin) / FLOW_TIME * FLOW_STEPS));
        draw(points, count);
        if (count < FLOW_STEPS) {
          frame = requestAnimationFrame(tick);
        } else {
          frame = 0;
        }
      }
      frame = requestAnimationFrame(tick);
    }

    replay.addEventListener("click", play);
    learnerToggle.pick(settings.learner);
    ddaToggle.pick(settings.adaptive);

    // Start the first run when the chart comes into view
    if (window.IntersectionObserver && !reduceMotion) {
      draw(simulate(LEARNERS[settings.learner], settings.adaptive), 0);
      var observer = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) {
          observer.disconnect();
          play();
        }
      }, { threshold: 0.4 });
      observer.observe(root);
    } else {
      play();
    }
  });
})();
