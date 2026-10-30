// NsSession showcase: a host makes a room code, and a friend types it and joins.
// The code rules, the step order, and the status lines are ports of the plugin C++ source. The network is simulated with fixed delays.
(function () {
  "use strict";

  // Simulated delays in milliseconds. The plugin waits for the online subsystem here
  var HOST_MAP_MS = 1200;
  var LAN_REPLY_MS = 500;
  var LAN_DONE_MS = 2500;
  var STEAM_DONE_MS = 1200;
  var WORLDWIDE_MS = 2000;
  var JOIN_MS = 700;
  var TRAVEL_MS = 1000;
  var LOG_LINES = 8;

  // Source/NsSession/Private/NsSessionTypes.cpp:36
  var NETWORK_NAME = { Lan: "LAN", Steam: "Steam" };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  NsShowcase.register(".ns-rooms", function (root) {
    // Source/NsSession/Public/NsSessionSubsystem.h:180 and :183
    var ALPHABET = root.dataset.alphabet || "ABCDEFGHJKLMNPQRSTUVWXYZ";
    var LENGTH = Number(root.dataset.length) || 5;

    // Status lines from the fragment. Source/NsSession/Private/NsSessionTypes.cpp:7
    var lines = {};
    root.querySelectorAll("li[data-status]").forEach(function (li) {
      var name = li.querySelector("b");
      lines[li.dataset.status] = li.textContent.slice(name ? name.textContent.length : 0).trim();
    });
    if (!lines.Searching) { throw new Error("no status lines"); }

    // Source/NsSession/Private/NsSessionTypes.cpp:7
    function statusText(status, code, network, detail) {
      return (lines[status] || status).replace("{Code}", code).replace("{Network}", NETWORK_NAME[network]).replace("{Detail}", detail || "");
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:168
    function normalizeRoomCode(code) {
      var upper = code.trim().toUpperCase();
      if (upper.length !== LENGTH) { return ""; }
      for (var i = 0; i < upper.length; i++) {
        if (ALPHABET.indexOf(upper.charAt(i)) < 0) { return ""; }
      }
      return upper;
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:185
    function makeRoomCode() {
      var code = "";
      for (var i = 0; i < LENGTH; i++) { code += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length)); }
      return code;
    }

    // ---------- DOM ----------
    var app = el("div", "ns-rooms-app");
    app.innerHTML =
      '<section class="ns-rooms-machine" aria-label="Host machine">' +
      '<p class="ns-rooms-title">Host</p>' +
      '<label class="ns-rooms-check"><input type="checkbox" data-k="hostSteam" checked> Steam runs on this machine</label>' +
      '<div class="ns-rooms-buttons"><button type="button" data-act="host">Host Room</button><button type="button" data-act="hostLeave">Leave Room</button></div>' +
      '<div class="ns-rooms-code" role="img" aria-label="No room code"></div>' +
      '<button type="button" class="ns-rooms-give" data-act="give" disabled>Give the code to the friend</button>' +
      '<p class="ns-rooms-state"></p>' +
      '<ol class="ns-rooms-log" aria-live="polite" aria-label="Host status lines"></ol>' +
      "</section>" +
      '<section class="ns-rooms-machine" aria-label="Friend machine">' +
      '<p class="ns-rooms-title">Friend</p>' +
      '<label class="ns-rooms-check"><input type="checkbox" data-k="friendSteam" checked> Steam runs on this machine</label>' +
      '<label class="ns-rooms-field">Place <select data-k="where">' +
      '<option value="lan">Same LAN as the host</option>' +
      '<option value="region">Other network, same Steam region</option>' +
      '<option value="far">Other network, other Steam region</option></select></label>' +
      '<label class="ns-rooms-field">Room code <input type="text" data-k="code" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="12" aria-describedby=""></label>' +
      '<div class="ns-rooms-code ns-rooms-typed" aria-hidden="true"></div>' +
      '<p class="ns-rooms-hint"></p>' +
      '<div class="ns-rooms-buttons"><button type="button" data-act="join">Join Room</button><button type="button" data-act="friendLeave">Leave Room</button></div>' +
      '<p class="ns-rooms-state"></p>' +
      '<ol class="ns-rooms-log" aria-live="polite" aria-label="Friend status lines"></ol>' +
      "</section>";
    root.insertBefore(app, root.querySelector(".ns-rooms-lines"));

    var sections = app.querySelectorAll(".ns-rooms-machine");
    var codeInput = app.querySelector('[data-k="code"]');
    var hint = app.querySelector(".ns-rooms-hint");
    hint.id = "ns-rooms-hint-" + Math.random().toString(36).slice(2, 8);
    codeInput.setAttribute("aria-describedby", hint.id);

    function machine(section) {
      return { section: section, log: section.querySelector(".ns-rooms-log"), state: section.querySelector(".ns-rooms-state"), timers: [], roomCode: "", network: "Lan" };
    }
    var host = machine(sections[0]);
    host.steam = true; host.pendingHost = false; host.sessionOpen = false;
    var friend = machine(sections[1]);
    friend.steam = true; friend.where = "lan"; friend.pending = ""; friend.lanSearch = null; friend.steamSearch = null;
    friend.worldwide = 0; friend.ticker = 0; friend.joinNetwork = "Lan"; friend.connected = false; friend.inRoom = false; friend.joining = false;

    function addLine(m, text, className) {
      var li = el("li", className, text);
      m.log.appendChild(li);
      while (m.log.children.length > LOG_LINES) { m.log.removeChild(m.log.firstChild); }
    }
    // Source/NsSession/Private/NsSessionSubsystem.cpp:551
    function report(m, status, failed, code, network, detail) {
      var li = el("li", failed ? "is-failed" : "is-step");
      li.appendChild(el("code", "", status));
      li.appendChild(document.createTextNode(" " + statusText(status, code, network, detail)));
      m.log.appendChild(li);
      while (m.log.children.length > LOG_LINES) { m.log.removeChild(m.log.firstChild); }
    }
    // A line that is not a status: an event, a log line, or a call that returns false
    function note(m, text) { addLine(m, text, "is-note"); }

    function later(m, ms, fn) {
      var id = setTimeout(function () {
        m.timers = m.timers.filter(function (t) { return t !== id; });
        fn();
        render();
      }, ms);
      m.timers.push(id);
      return id;
    }
    function clearTimers(m) { m.timers.forEach(clearTimeout); m.timers = []; }

    // ---------- Host ----------
    // Source/NsSession/Private/NsSessionSubsystem.cpp:47 (the map is set and in the build, so NoMap and MapMissing do not occur here)
    function hostRoom() {
      if (host.pendingHost) { note(host, "Host Room returns false: the host waits for its map."); return; }
      hostLeave();
      host.roomCode = makeRoomCode();
      // Source/NsSession/Private/NsSessionSubsystem.cpp:209
      host.network = host.steam ? "Steam" : "Lan";
      host.pendingHost = true;
      report(host, "Opening", false, host.roomCode, host.network);
      // Source/NsSession/Private/NsSessionSubsystem.cpp:222, then CreateRoomSession at :263
      later(host, HOST_MAP_MS, function () {
        note(host, "The map loads as a listen server. On Room Entered fires.");
        host.pendingHost = false;
        host.sessionOpen = true;
        note(host, "Log: Room " + host.roomCode + " is open on " + NETWORK_NAME[host.network] + ".");
      });
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:111 (then the game opens the title map, so a connected friend loses the host)
    function hostLeave() {
      clearTimers(host);
      host.pendingHost = false;
      host.sessionOpen = false;
      host.roomCode = "";
      if (friend.connected) { friendLostHost(); }
    }

    // ---------- Friend ----------
    // Source/NsSession/Private/NsSessionSubsystem.cpp:137
    function isSearching() { return friend.lanSearch !== null || friend.steamSearch !== null; }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:78
    function joinRoom() {
      var typed = codeInput.value;
      var normalized = normalizeRoomCode(typed);
      if (!normalized) { report(friend, "BadCode", true, typed, "Lan"); return; }
      if (isSearching()) { note(friend, "Join Room returns false: a search runs."); return; }
      friendLeave();
      friend.pending = normalized;
      startSearch("Lan");
      if (friend.steam) { startSearch("Steam"); }
      // The LAN search fills its results one reply at a time, so a ticker checks for the code
      friend.ticker = setInterval(tickSearch, 100);
      report(friend, "Searching", false, friend.pending, "Lan");
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:321
    function startSearch(network) {
      var search = { results: [] };
      if (network === "Steam") {
        friend.steamSearch = search;
        // Steam filters on its servers and sends back only the room with this code, in this region
        later(friend, STEAM_DONE_MS, function () {
          if (friend.steamSearch !== search) { return; }
          if (host.sessionOpen && host.network === "Steam" && friend.where !== "far" && host.roomCode === friend.pending) {
            search.results.push({ code: host.roomCode });
          }
          handleSearchComplete("Steam");
        });
      } else {
        friend.lanSearch = search;
        // The LAN search gets every room on the network
        later(friend, LAN_REPLY_MS, function () {
          if (friend.lanSearch !== search || !(host.sessionOpen && host.network === "Lan" && friend.where === "lan")) { return; }
          search.results.push({ code: host.roomCode });
          note(friend, "LAN reply: a room with code " + host.roomCode + ".");
        });
        later(friend, LAN_DONE_MS, function () {
          if (friend.lanSearch === search) { handleSearchComplete("Lan"); }
        });
      }
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:361
    function handleSearchComplete(network) {
      var key = network === "Steam" ? "steamSearch" : "lanSearch";
      if (friend[key] === null) { return; }
      // A match joins now. Otherwise this search ends and the other network can still find the room
      if (!tryJoinMatch()) {
        friend[key] = null;
        finishSearchWithoutMatch();
      }
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:382
    function tickSearch() {
      if (tryJoinMatch() || !isSearching()) { stopTicker(); }
      render();
    }
    function stopTicker() { if (friend.ticker) { clearInterval(friend.ticker); friend.ticker = 0; } }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:387 and HasPendingCode at :543 (both machines run the same game)
    function tryJoinMatch() {
      var networks = ["Lan", "Steam"];
      for (var n = 0; n < networks.length; n++) {
        var search = networks[n] === "Lan" ? friend.lanSearch : friend.steamSearch;
        if (search === null) { continue; }
        for (var i = 0; i < search.results.length; i++) {
          if (search.results[i].code === friend.pending) {
            joinFoundRoom(networks[n], search.results[i]);
            return true;
          }
        }
      }
      return false;
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:410
    function finishSearchWithoutMatch() {
      if (isSearching()) { return; }
      stopSearches();
      if (startWorldwideSearch()) { return; }
      report(friend, "NotFound", true, friend.pending, "Lan");
      friend.pending = "";
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:425 (the Steam lobby search is available when Steam runs)
    function startWorldwideSearch() {
      if (!friend.steam) { return false; }
      friend.worldwide = later(friend, WORLDWIDE_MS, function () {
        var found = host.sessionOpen && host.network === "Steam" && host.roomCode === friend.pending;
        handleWorldwideResult(found ? "host" : "");
      });
      report(friend, "SearchingWorldwide", false, friend.pending, "Steam");
      return true;
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:444
    function handleWorldwideResult(hostSteamId) {
      friend.worldwide = 0;
      if (!hostSteamId) {
        report(friend, "NotFound", true, friend.pending, "Steam");
        friend.pending = "";
        return;
      }
      friend.roomCode = friend.pending;
      friend.network = "Steam";
      friend.pending = "";
      report(friend, "FoundWorldwide", false, friend.roomCode, "Steam");
      clientTravel();
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:464
    function stopSearches() {
      if (friend.worldwide) { clearTimeout(friend.worldwide); friend.worldwide = 0; }
      stopTicker();
      friend.lanSearch = null;
      friend.steamSearch = null;
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:493
    function joinFoundRoom(network, result) {
      stopSearches();
      friend.joinNetwork = network;
      friend.joining = true;
      report(friend, "Found", false, friend.pending, network);
      later(friend, JOIN_MS, function () { friend.joining = false; handleJoinSessionComplete(result); });
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:513 (the join succeeds while the host room is still open)
    function handleJoinSessionComplete(result) {
      if (!(host.sessionOpen && host.roomCode === result.code)) {
        report(friend, "JoinRefused", true, friend.pending, friend.joinNetwork);
        return;
      }
      friend.roomCode = friend.pending;
      friend.network = friend.joinNetwork;
      friend.pending = "";
      note(friend, "Log: Joining room " + friend.roomCode + ".");
      clientTravel();
    }

    // Client travel to the host. When the map loads, On Room Entered fires: Source/NsSession/Private/NsSessionSubsystem.cpp:222
    function clientTravel() {
      friend.connected = true;
      later(friend, TRAVEL_MS, function () {
        friend.inRoom = true;
        note(friend, "The map loads as a client. On Room Entered fires.");
      });
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:111
    function friendLeave() {
      stopSearches();
      clearTimers(friend);
      friend.roomCode = "";
      friend.connected = false;
      friend.inRoom = false;
      friend.joining = false;
    }

    // Source/NsSession/Private/NsSessionSubsystem.cpp:251 (the connection is lost, so the status is HostLeft)
    function friendLostHost() {
      var code = friend.roomCode;
      friendLeave();
      report(friend, "HostLeft", true, code, friend.network, "Connection lost");
    }

    // ---------- View ----------
    function fillCode(box, text, check) {
      box.innerHTML = "";
      var count = Math.max(LENGTH, text.length);
      for (var i = 0; i < count; i++) {
        var ch = text.charAt(i);
        var slot = el("span", "ns-rooms-slot", ch || " ");
        if (check && ch && ALPHABET.indexOf(ch) < 0) { slot.classList.add("is-bad"); }
        if (i >= LENGTH) { slot.classList.add("is-extra"); }
        box.appendChild(slot);
      }
    }

    function validate() {
      var upper = codeInput.value.trim().toUpperCase();
      fillCode(app.querySelector(".ns-rooms-typed"), upper, true);
      var bad = [];
      for (var i = 0; i < upper.length; i++) {
        var ch = upper.charAt(i), label = ch === " " ? "space" : ch;
        if (ALPHABET.indexOf(ch) < 0 && bad.indexOf(label) < 0) { bad.push(label); }
      }
      var text, ok = false;
      if (upper.length === 0) { text = "Type the code that the host gives."; }
      else if (bad.length > 0) {
        text = "Not in the alphabet: " + bad.join(", ") + ".";
        if (bad.indexOf("I") >= 0 || bad.indexOf("O") >= 0) { text += " I and O are not used, so players cannot mix them up with 1 and 0."; }
      } else if (upper.length !== LENGTH) { text = upper.length + " of " + LENGTH + " letters."; }
      else { text = "Valid code: " + upper + "."; ok = true; }
      hint.textContent = text;
      hint.classList.toggle("is-ok", ok);
      codeInput.setAttribute("aria-invalid", upper.length > 0 && !ok ? "true" : "false");
    }

    function render() {
      var codeBox = host.section.querySelector(".ns-rooms-code");
      fillCode(codeBox, host.roomCode, false);
      codeBox.setAttribute("aria-label", host.roomCode ? "Room code " + host.roomCode.split("").join(" ") : "No room code");
      codeBox.classList.toggle("is-open", host.sessionOpen);
      host.section.querySelector('[data-act="give"]').disabled = !host.roomCode;
      host.state.textContent = host.pendingHost ? "The map opens. The session is not created yet."
        : host.sessionOpen ? "In room " + host.roomCode + " on " + NETWORK_NAME[host.network] + ". Players: " + (friend.inRoom ? "host and friend." : "host.")
        : "Not in a room.";
      var nets = [];
      if (friend.lanSearch) { nets.push("LAN"); }
      if (friend.steamSearch) { nets.push("Steam"); }
      friend.state.textContent = nets.length ? "Searching on " + nets.join(" and ") + "."
        : friend.worldwide ? "Searching Steam in every region."
        : friend.inRoom ? "In room " + friend.roomCode + " on " + NETWORK_NAME[friend.network] + "."
        : friend.connected ? "Travels to the host."
        : friend.joining ? "Joins the session."
        : "Not in a room.";
    }

    // ---------- Input ----------
    var actions = {
      host: hostRoom,
      hostLeave: function () {
        hostLeave();
        note(host, "Leave Room ends the session. The game opens its title map.");
      },
      give: function () {
        codeInput.value = host.roomCode;
        validate();
        codeInput.focus();
      },
      join: joinRoom,
      friendLeave: function () { friendLeave(); note(friend, "Leave Room stops the searches and ends the session here."); }
    };
    app.querySelectorAll("[data-act]").forEach(function (button) {
      button.addEventListener("click", function () {
        actions[button.dataset.act]();
        render();
      });
    });
    app.querySelector('[data-k="hostSteam"]').addEventListener("change", function (e) { host.steam = e.target.checked; });
    app.querySelector('[data-k="friendSteam"]').addEventListener("change", function (e) { friend.steam = e.target.checked; });
    app.querySelector('[data-k="where"]').addEventListener("change", function (e) { friend.where = e.target.value; });
    codeInput.addEventListener("input", validate);
    codeInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); joinRoom(); render(); }
    });

    validate();
    render();
  });
})();
