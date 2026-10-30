// NsInteraction showcase: a room seen from above. A sensor gives targets, the interaction component picks one option, and a hold runs it.
// The rules are ports of the plugin C++ source. Each ported function names its source file and line.
(function () {
  "use strict";

  var ACCENT = "#f03a6c";
  // Source/NsInteraction/Private/NsInteractionComponent.cpp:270 (one priority step is worth more than any distance)
  var PRIORITY_STEP = 100000;
  // Source/NsInteraction/Public/NsInteractionViewSensor.h:83
  var BLOCKER_SLACK_CM = 10;
  var KINDA_SMALL_NUMBER = 1e-4;
  var PLAYER_RADIUS_CM = 30;
  var SPEED_CM_PER_S = 250;
  var FLASH_SECONDS = 0.6;

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function nums(text) { return String(text || "").trim().split(/\s+/).map(Number); }
  function now() { return performance.now() / 1000; }
  function boxDistSq(b, px, py) {
    var dx = Math.max(b.minX - px, 0, px - b.maxX);
    var dy = Math.max(b.minY - py, 0, py - b.maxY);
    return dx * dx + dy * dy;
  }
  function closestOnBox(b, px, py) { return [clamp(px, b.minX, b.maxX), clamp(py, b.minY, b.maxY)]; }

  // Ray against an axis-aligned box (slab test). Returns the distance along the unit direction, or -1
  function rayBox(ox, oy, dx, dy, b, maxDist) {
    var tMin = 0, tMax = maxDist, o = [ox, oy], d = [dx, dy], lo = [b.minX, b.minY], hi = [b.maxX, b.maxY];
    for (var i = 0; i < 2; i++) {
      if (Math.abs(d[i]) < 1e-9) {
        if (o[i] < lo[i] || o[i] > hi[i]) { return -1; }
      } else {
        var t1 = (lo[i] - o[i]) / d[i], t2 = (hi[i] - o[i]) / d[i];
        if (t1 > t2) { var s = t1; t1 = t2; t2 = s; }
        tMin = Math.max(tMin, t1);
        tMax = Math.min(tMax, t2);
        if (tMin > tMax) { return -1; }
      }
    }
    return tMin;
  }

  // Option of one item. Defaults: Source/NsInteraction/Public/NsInteractionTypes.h:76-117
  // NsInteractableActor defaults: Source/NsInteraction/Private/NsInteractableActor.cpp:13-15
  function readOption(d) {
    var actor = d.actor === "NsInteractableActor";
    return {
      actionId: d.action || (actor ? "Use" : "None"),
      tapActionId: d.tap || "None",
      title: d.title || "",
      prompt: d.prompt !== undefined ? d.prompt : (actor ? "Use" : ""),
      enabled: d.enabled !== "false",
      input: d.input === "Hold" ? "Hold" : "Press",
      holdSeconds: d.hold !== undefined ? Math.max(0, Number(d.hold) || 0) : 0.5,
      priority: Number(d.priority) || 0
    };
  }

  NsShowcase.register(".ns-interact", function (root) {
    var items = Array.prototype.slice.call(root.querySelectorAll("li[data-box]"));
    if (items.length === 0) { throw new Error("no targets"); }
    var ds = root.dataset;
    var room = nums(ds.room || "1000 600");
    var roomW = room[0], roomH = room[1];
    var start = nums(ds.player || "500 470");
    var aimAt = nums(ds.aimAt || "500 0");
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Settings. Defaults: Source/NsInteraction/Private/NsInteractionViewSensor.cpp:14-18 and NsInteractionComponent.cpp:10-16
    var S = {
      mode: "view",
      trace: Number(ds.traceDistanceCm || 300),
      assist: Number(ds.assistAngleDeg || 0),
      stick: Number(ds.assistStickDeg || 2),
      maxDist: Number(ds.maxDistanceCm || 0),
      sphere: Number(ds.sphereCm || 250),
      interval: Number(ds.refreshInterval || 0)
    };

    var things = items.map(function (li) {
      var b = nums(li.dataset.box);
      var name = li.querySelector("b");
      return {
        name: name ? name.textContent : "Target",
        x: b[0], y: b[1], w: b[2], h: b[3],
        box: { minX: b[0] - b[2] / 2, maxX: b[0] + b[2] / 2, minY: b[1] - b[3] / 2, maxY: b[1] + b[3] / 2 },
        interactable: li.dataset.interactable !== "false",
        option: readOption(li.dataset),
        flash: -1
      };
    });

    var player = { x: start[0], y: start[1], angle: Math.atan2(aimAt[1] - start[1], aimAt[0] - start[0]) };
    var comp = { targets: [], hasOption: false, best: null, hold: null, holdStart: 0, refreshWait: 0 };
    var focus = null, sensorHit = null, sensorAssist = null;
    var keys = {}, pressed = false, drag = null, raf = 0, lastTime = 0, scale = 1;
    var logText = "";

    // ---------- DOM ----------
    var app = document.createElement("div");
    app.className = "ns-interact-app";
    app.innerHTML =
      '<div class="ns-interact-stage"><canvas tabindex="0" aria-label="Room from above. Arrow keys or WASD walk, the player faces the walk. Hold E to interact."></canvas></div>' +
      '<div class="ns-interact-side">' +
      '<label class="ns-interact-row">Sensor <select data-k="mode"><option value="view">View sensor (trace and assist)</option><option value="nearby">Nearby sphere (overlap)</option></select></label>' +
      '<label class="ns-interact-row" data-only="view">Trace Distance Cm <output></output><input type="range" data-k="trace" min="50" max="600" step="10"></label>' +
      '<label class="ns-interact-row" data-only="view">Assist Angle Deg <output></output><input type="range" data-k="assist" min="0" max="45" step="1"></label>' +
      '<label class="ns-interact-row">Max Distance Cm <output></output><input type="range" data-k="maxDist" min="0" max="600" step="10"></label>' +
      '<label class="ns-interact-row" data-only="nearby">Refresh Interval <output></output><input type="range" data-k="interval" min="0" max="1" step="0.05"></label>' +
      '<p class="ns-interact-hint" data-only="nearby">With Refresh Interval 0, the component picks again only when a target enters or leaves the sphere, or when you press E.</p>' +
      '<button type="button" class="ns-interact-use" aria-label="Interact. Hold for a hold option."><span class="ns-interact-fill"></span><span class="ns-interact-key">E</span><span class="ns-interact-label">Interact</span></button>' +
      '<p class="ns-interact-focus"></p>' +
      '<ol class="ns-interact-targets" aria-label="Targets of the component, in order"></ol>' +
      '<p class="ns-interact-log" aria-live="polite"></p>' +
      "</div>";
    root.insertBefore(app, root.querySelector("ul"));

    var stage = app.querySelector(".ns-interact-stage");
    var canvas = app.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var useButton = app.querySelector(".ns-interact-use");
    var fill = app.querySelector(".ns-interact-fill");
    var focusLine = app.querySelector(".ns-interact-focus");
    var targetList = app.querySelector(".ns-interact-targets");
    var logLine = app.querySelector(".ns-interact-log");

    function log(text) { logText = text; logLine.textContent = text; }

    // ---------- Interaction component ----------
    // Source/NsInteraction/Private/NsInteractionComponent.cpp:239 (all items here give their option, so only the interface check stays)
    function queryOption(t) { return t && t.interactable ? t.option : null; }
    function distanceTo(t) { return Math.hypot(player.x - t.x, player.y - t.y); }

    // Source/NsInteraction/Private/NsInteractionComponent.cpp:304
    function isInReach(t) { return S.maxDist <= 0 || distanceTo(t) <= S.maxDist; }

    // Source/NsInteraction/Private/NsInteractionComponent.cpp:267
    function scoreOption(t) { return t.option.priority * PRIORITY_STEP - distanceTo(t); }

    // Source/NsInteraction/Private/NsInteractionComponent.cpp:73 (the player is the owner, so it is never a target)
    function setTargets(list) {
      var next = [];
      list.forEach(function (t) { if (next.indexOf(t) < 0) { next.push(t); } });
      comp.targets = next;
      refresh();
    }
    // Source/NsInteraction/Private/NsInteractionComponent.cpp:51, :64, :114
    function addTarget(t) { if (comp.targets.indexOf(t) < 0) { setTargets(comp.targets.concat([t])); } }
    function removeTarget(t) { if (comp.targets.indexOf(t) >= 0) { setTargets(comp.targets.filter(function (o) { return o !== t; })); } }
    function clearTargets() { if (comp.targets.length > 0) { setTargets([]); } }

    // Source/NsInteraction/Private/NsInteractionComponent.cpp:134
    function refresh() {
      var found = null, bestScore = 0;
      comp.targets.forEach(function (t) {
        if (!isInReach(t) || !queryOption(t)) { return; }
        // The first target wins a tie, so a sensor can give its targets in order
        var score = scoreOption(t);
        if (found === null || score > bestScore) { found = t; bestScore = score; }
      });
      // The options here never change, so "shows the same prompt" means "same target"
      var changed = (found !== null) !== comp.hasOption || (found !== null && found !== comp.best);
      comp.hasOption = found !== null;
      comp.best = found;
      if (!changed) { return; }
      // A hold ends when the target changes
      if (comp.hold && !(comp.hasOption && comp.best === comp.hold)) {
        comp.hold = null;
        log("The hold stops: the best target changed.");
      }
    }

    // Source/NsInteraction/Private/NsInteractionComponent.cpp:175
    function beginInteract() {
      refresh();
      if (!comp.hasOption) { log("Begin Interact returns false: no target gives an option."); return false; }
      var t = comp.best;
      if (t.option.input === "Hold") {
        comp.hold = t;
        comp.holdStart = now();
        return true;
      }
      runAction(t, t.option.actionId);
      return true;
    }

    // Source/NsInteraction/Private/NsInteractionComponent.cpp:195
    function endInteract() {
      if (!comp.hold) { return; }
      // The hold did not finish, so the press was a tap
      var held = comp.hold;
      comp.hold = null;
      if (held.option.tapActionId !== "None") { runAction(held, held.option.tapActionId); }
      else { log("Release before the end: no tap action, so nothing runs."); }
    }

    // Source/NsInteraction/Private/NsInteractionComponent.cpp:211
    function holdProgress(time) {
      if (!comp.hold) { return 0; }
      return clamp((time - comp.holdStart) / Math.max(comp.hold.option.holdSeconds, KINDA_SMALL_NUMBER), 0, 1);
    }

    // Source/NsInteraction/Private/NsInteractionComponent.cpp:276 (one machine, so a Server option also runs here)
    function runAction(t, actionId) {
      if (!t.option.enabled) { log(t.name + ": the option is disabled, so nothing runs."); return; }
      t.flash = now();
      log("Execute Interaction on " + t.name + ": action " + actionId + ".");
    }

    // ---------- View sensor ----------
    // First box on a line, like LineTraceSingleByChannel. Every item blocks the channel
    function trace(x0, y0, x1, y1) {
      var dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), best = null;
      if (len < 1e-6) { return null; }
      things.forEach(function (t) {
        var dist = rayBox(x0, y0, dx / len, dy / len, t.box, len);
        if (dist >= 0 && (best === null || dist < best.distance)) { best = { thing: t, distance: dist }; }
      });
      return best;
    }

    // Source/NsInteraction/Private/NsInteractionViewSensor.cpp:158 (2D, and the boxes do not turn, so local space is world space)
    function measureViewAngle(sx, sy, fx, fy, part) {
      var ex = sx + fx * S.trace, ey = sy + fy * S.trace, low = 0, high = 1;
      // The distance from the view line to a box falls, then rises, so a ternary search finds the nearest point
      for (var step = 0; step < 24; step++) {
        var lowThird = low + (high - low) / 3, highThird = high - (high - low) / 3;
        if (boxDistSq(part.box, lerp(sx, ex, lowThird), lerp(sy, ey, lowThird)) <=
            boxDistSq(part.box, lerp(sx, ex, highThird), lerp(sy, ey, highThird))) { high = highThird; }
        else { low = lowThird; }
      }
      var mid = (low + high) * 0.5;
      var p = closestOnBox(part.box, lerp(sx, ex, mid), lerp(sy, ey, mid));
      var tx = p[0] - sx, ty = p[1] - sy, dist = Math.hypot(tx, ty);
      if (dist > S.trace) { return null; }
      var angle = dist < KINDA_SMALL_NUMBER ? 0 : Math.acos(clamp((fx * tx + fy * ty) / dist, -1, 1)) * 180 / Math.PI;
      // Another item in front of the part hides it
      var blocker = trace(sx, sy, p[0], p[1]);
      var visible = !blocker || blocker.thing === part || blocker.distance >= dist - BLOCKER_SLACK_CM;
      return visible ? angle : null;
    }

    // Source/NsInteraction/Private/NsInteractionViewSensor.cpp:114 (the overlap order is the list order)
    function findAssistTargets(sx, sy, fx, fy, stickyPart) {
      var scored = [];
      if (S.trace <= 0) { return scored; }
      things.forEach(function (t, index) {
        if (!t.interactable || boxDistSq(t.box, sx, sy) > S.trace * S.trace) { return; }
        var stick = t === stickyPart ? S.stick : 0;
        var angle = measureViewAngle(sx, sy, fx, fy, t);
        if (angle !== null && angle <= S.assist + stick) { scored.push({ key: angle - stick, angle: angle, thing: t, index: index }); }
      });
      scored.sort(function (a, b) { return a.key - b.key || a.index - b.index; });
      return scored;
    }

    // Source/NsInteraction/Private/NsInteractionViewSensor.cpp:56 (the view starts at the player center)
    function refreshFocus() {
      var fx = Math.cos(player.angle), fy = Math.sin(player.angle);
      sensorHit = trace(player.x, player.y, player.x + fx * S.trace, player.y + fy * S.trace);
      sensorAssist = null;
      // The exact aim wins. The aim assist runs only when the exact aim gives no option
      var lastPart = focus;
      var next = sensorHit && queryOption(sensorHit.thing) ? sensorHit.thing : null;
      if (!next && S.assist > 0) {
        var list = findAssistTargets(player.x, player.y, fx, fy, lastPart);
        // Source/NsInteraction/Private/NsInteractionViewSensor.cpp:216
        for (var i = 0; i < list.length && !next; i++) {
          if (queryOption(list[i].thing)) { next = list[i].thing; sensorAssist = list[i]; }
        }
      }
      focus = next;
      if (focus) { setTargets([focus]); } else { clearTargets(); }
    }

    // ---------- Nearby sphere ----------
    // An overlap shape on the pawn calls Handle Sensor Begin and End Overlap: NsInteractionComponent.cpp:122, :128
    function updateOverlaps() {
      things.forEach(function (t) {
        var inside = boxDistSq(t.box, player.x, player.y) <= S.sphere * S.sphere;
        var listed = comp.targets.indexOf(t) >= 0;
        if (inside && !listed) { addTarget(t); }
        else if (!inside && listed) { removeTarget(t); }
      });
    }

    // ---------- Movement ----------
    function pushOut() {
      var r = PLAYER_RADIUS_CM;
      things.forEach(function (t) {
        var b = t.box, c = closestOnBox(b, player.x, player.y);
        var dx = player.x - c[0], dy = player.y - c[1], d = Math.hypot(dx, dy);
        if (d >= r) { return; }
        if (d > 1e-6) { player.x = c[0] + dx / d * r; player.y = c[1] + dy / d * r; return; }
        var sides = [player.x - b.minX, b.maxX - player.x, player.y - b.minY, b.maxY - player.y];
        var m = Math.min.apply(null, sides);
        if (m === sides[0]) { player.x = b.minX - r; } else if (m === sides[1]) { player.x = b.maxX + r; }
        else if (m === sides[2]) { player.y = b.minY - r; } else { player.y = b.maxY + r; }
      });
      player.x = clamp(player.x, r, roomW - r);
      player.y = clamp(player.y, r, roomH - r);
    }

    function walk(dt) {
      var mx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0), my = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
      if (mx === 0 && my === 0) { return false; }
      var len = Math.hypot(mx, my);
      player.x += mx / len * SPEED_CM_PER_S * dt;
      player.y += my / len * SPEED_CM_PER_S * dt;
      player.angle = Math.atan2(my, mx);
      pushOut();
      return true;
    }

    // ---------- Frame ----------
    function frame() {
      raf = 0;
      var time = now(), dt = Math.min(0.05, Math.max(0, time - lastTime));
      lastTime = time;
      var moved = walk(dt) || drag === "move";
      if (S.mode === "view") {
        // The view sensor ticks each frame
        refreshFocus();
      } else {
        if (moved) { updateOverlaps(); }
        // Source/NsInteraction/Private/NsInteractionComponent.cpp:26
        if (S.interval > 0 && comp.targets.length > 0) {
          comp.refreshWait -= dt;
          if (comp.refreshWait <= 0) { comp.refreshWait = S.interval; refresh(); }
        }
      }
      // Source/NsInteraction/Private/NsInteractionComponent.cpp:36
      if (comp.hold && holdProgress(time) >= 1) {
        var held = comp.hold;
        comp.hold = null;
        runAction(held, held.option.actionId);
      }
      draw(time);
      updatePanel(time);
      var flashing = things.some(function (t) { return t.flash >= 0 && time - t.flash < FLASH_SECONDS; });
      var walking = keys.up || keys.down || keys.left || keys.right;
      if (walking || drag || comp.hold || flashing) { kick(); }
    }
    function kick() {
      if (!raf) {
        if (!lastTime || now() - lastTime > 0.1) { lastTime = now(); }
        raf = requestAnimationFrame(frame);
      }
    }

    // ---------- Drawing ----------
    function resize() {
      var w = stage.clientWidth, h = Math.round(w * roomH / roomW), dpr = window.devicePixelRatio || 1;
      if (w <= 0) { return; }
      canvas.style.height = h + "px";
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = w / roomW;
      draw(now());
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    function draw(time) {
      var W = roomW * scale, H = roomH * scale, k = scale;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#101114";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (var gx = 100; gx < roomW; gx += 100) { ctx.beginPath(); ctx.moveTo(gx * k, 0); ctx.lineTo(gx * k, H); ctx.stroke(); }
      for (var gy = 100; gy < roomH; gy += 100) { ctx.beginPath(); ctx.moveTo(0, gy * k); ctx.lineTo(W, gy * k); ctx.stroke(); }

      var px = player.x * k, py = player.y * k, fx = Math.cos(player.angle), fy = Math.sin(player.angle);
      ctx.setLineDash([4, 4]);
      if (S.maxDist > 0) {
        ctx.strokeStyle = "rgba(240,58,108,0.35)";
        ctx.beginPath(); ctx.arc(px, py, S.maxDist * k, 0, Math.PI * 2); ctx.stroke();
      }
      if (S.mode === "nearby") {
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.beginPath(); ctx.arc(px, py, S.sphere * k, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.setLineDash([]);
      if (S.mode === "view") {
        if (S.assist > 0) {
          var a = S.assist * Math.PI / 180;
          ctx.fillStyle = "rgba(240,58,108,0.07)";
          ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, S.trace * k, player.angle - a, player.angle + a); ctx.closePath(); ctx.fill();
        }
        var hitDist = sensorHit ? sensorHit.distance : S.trace;
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.beginPath(); ctx.moveTo(px + fx * hitDist * k, py + fy * hitDist * k); ctx.lineTo(px + fx * S.trace * k, py + fy * S.trace * k); ctx.stroke();
        ctx.strokeStyle = ACCENT;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + fx * hitDist * k, py + fy * hitDist * k); ctx.stroke();
      }

      ctx.font = '11px "Overpass Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      things.forEach(function (t) {
        var x = t.box.minX * k, y = t.box.minY * k, w = t.w * k, h = t.h * k;
        var flash = t.flash >= 0 ? 1 - (time - t.flash) / FLASH_SECONDS : 0;
        ctx.fillStyle = t.interactable ? "#1d1f26" : "#2a2c33";
        ctx.fillRect(x, y, w, h);
        if (flash > 0) {
          ctx.fillStyle = "rgba(240,58,108," + (reduced ? 0.5 : 0.6 * flash).toFixed(3) + ")";
          ctx.fillRect(x, y, w, h);
        }
        ctx.lineWidth = t === comp.best ? 2 : 1;
        ctx.strokeStyle = t === comp.best ? ACCENT : (t.interactable ? "#4a4d57" : "#3a3c44");
        if (t.interactable && !t.option.enabled) { ctx.setLineDash([3, 3]); }
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        ctx.setLineDash([]);
        var order = comp.targets.indexOf(t);
        ctx.fillStyle = order >= 0 ? "#989898" : "#666666";
        ctx.fillText((S.mode === "nearby" && order >= 0 ? (order + 1) + " " : "") + t.name, x + w / 2, y + h + 16 > H ? y - 15 : y + h + 4);
      });
      ctx.lineWidth = 1;

      // Player and its aim
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(px, py, PLAYER_RADIUS_CM * k, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#101114";
      ctx.beginPath(); ctx.arc(px + fx * PLAYER_RADIUS_CM * 0.55 * k, py + fy * PLAYER_RADIUS_CM * 0.55 * k, Math.max(2, 7 * k), 0, Math.PI * 2); ctx.fill();
      if (document.activeElement === canvas) {
        ctx.strokeStyle = ACCENT;
        ctx.beginPath(); ctx.arc(px, py, PLAYER_RADIUS_CM * k + 3, 0, Math.PI * 2); ctx.stroke();
      }

      if (comp.hasOption) { drawPrompt(comp.best, holdProgress(time), W, H); }
    }

    // Prompt at the prompt location: the center of the part, here above its box
    function drawPrompt(t, progress, W, H) {
      var o = t.option, k = scale;
      var text = (o.input === "Hold" ? "Hold " : "") + (o.prompt || o.actionId);
      ctx.font = "13px sans-serif";
      var tw = ctx.measureText(text).width;
      ctx.font = "11px sans-serif";
      var titleW = o.title ? ctx.measureText(o.title).width : 0;
      var bw = Math.max(tw + 34, titleW + 16), bh = o.title ? 44 : 30;
      var bx = clamp(t.x * k - bw / 2, 4, W - bw - 4);
      var by = t.box.minY * k - bh - 8;
      if (by < 4) { by = Math.min(t.box.maxY * k + 22, H - bh - 4); }
      ctx.fillStyle = "rgba(10,10,12,0.92)";
      roundRect(bx, by, bw, bh, 6); ctx.fill();
      ctx.strokeStyle = o.enabled ? "rgba(240,58,108,0.6)" : "#3a3c44";
      ctx.stroke();
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      var row = by + bh - 15;
      if (o.title) { ctx.fillStyle = "#989898"; ctx.fillText(o.title, bx + 8, by + 12); }
      var kx = bx + 15;
      ctx.fillStyle = o.enabled ? "#ffffff" : "#444650";
      roundRect(kx - 8, row - 8, 16, 16, 3); ctx.fill();
      ctx.fillStyle = "#101114";
      ctx.font = 'bold 11px "Overpass Mono", monospace';
      ctx.textAlign = "center";
      ctx.fillText("E", kx, row + 1);
      if (o.input === "Hold" && progress > 0) {
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(kx, row, 11, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 1;
      }
      ctx.textAlign = "left";
      ctx.font = "13px sans-serif";
      ctx.fillStyle = o.enabled ? "#ffffff" : "#666666";
      ctx.fillText(text, bx + 28, row + 1);
    }

    // ---------- Panel ----------
    var lastPanel = "";
    function updatePanel(time) {
      var o = comp.hasOption ? comp.best.option : null;
      var focusText = o
        ? "Option: " + comp.best.name + ", " + (o.prompt || o.actionId) + (o.input === "Hold" ? ", hold " + o.holdSeconds + " s" : ", press") + (o.enabled ? "" : ", disabled") + "."
        : "No option.";
      if (S.mode === "view") {
        focusText += " Trace: " + (sensorHit ? sensorHit.thing.name + " at " + Math.round(sensorHit.distance) + " cm" : "nothing") + ".";
        if (sensorAssist) { focusText += " Assist: " + sensorAssist.thing.name + " at " + sensorAssist.angle.toFixed(1) + " deg."; }
      }
      var rows = comp.targets.map(function (t) {
        var note = !queryOption(t) ? "no option" : !isInReach(t) ? "out of reach" : "score " + Math.round(scoreOption(t));
        return t.name + ", " + Math.round(distanceTo(t)) + " cm, " + note + (t === comp.best ? ", picked" : "");
      });
      var key = focusText + "|" + rows.join("|");
      if (key !== lastPanel) {
        lastPanel = key;
        focusLine.textContent = focusText;
        targetList.innerHTML = "";
        rows.forEach(function (text, i) {
          var li = document.createElement("li");
          li.textContent = text;
          if (comp.targets[i] === comp.best) { li.className = "is-best"; }
          targetList.appendChild(li);
        });
      }
      var p = holdProgress(time);
      fill.style.width = (p * 100).toFixed(1) + "%";
    }

    // ---------- Input ----------
    function press() {
      if (pressed) { return; }
      pressed = true;
      useButton.classList.add("is-down");
      beginInteract();
      kick();
    }
    function release() {
      if (!pressed) { return; }
      pressed = false;
      useButton.classList.remove("is-down");
      endInteract();
      kick();
    }

    var KEY_MAP = { ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" };
    canvas.addEventListener("keydown", function (e) {
      var dir = KEY_MAP[e.key];
      if (dir) { e.preventDefault(); keys[dir] = true; kick(); }
      else if ((e.key === "e" || e.key === "E") && !e.repeat) { e.preventDefault(); press(); }
    });
    canvas.addEventListener("keyup", function (e) {
      var dir = KEY_MAP[e.key];
      if (dir) { keys[dir] = false; }
      else if (e.key === "e" || e.key === "E") { release(); }
    });
    canvas.addEventListener("focus", function () { kick(); });
    canvas.addEventListener("blur", function () { keys = {}; release(); kick(); });

    function toWorld(e) {
      var r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale };
    }
    function applyDrag(p) {
      if (drag === "move") { player.x = p.x; player.y = p.y; pushOut(); }
      else if (Math.hypot(p.x - player.x, p.y - player.y) > 1) { player.angle = Math.atan2(p.y - player.y, p.x - player.x); }
      kick();
    }
    canvas.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) { return; }
      e.preventDefault();
      canvas.focus({ preventScroll: true });
      var p = toWorld(e);
      drag = Math.hypot(p.x - player.x, p.y - player.y) <= PLAYER_RADIUS_CM + 14 / scale ? "move" : "aim";
      canvas.setPointerCapture(e.pointerId);
      applyDrag(p);
    });
    canvas.addEventListener("pointermove", function (e) { if (drag) { applyDrag(toWorld(e)); } });
    function endDrag() { if (drag) { drag = null; if (S.mode === "nearby") { updateOverlaps(); } kick(); } }
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    useButton.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) { return; }
      e.preventDefault();
      useButton.focus({ preventScroll: true });
      useButton.setPointerCapture(e.pointerId);
      press();
    });
    useButton.addEventListener("pointerup", release);
    useButton.addEventListener("pointercancel", release);
    useButton.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    useButton.addEventListener("keydown", function (e) {
      if ((e.key === " " || e.key === "Enter" || e.key === "e" || e.key === "E") && !e.repeat) { e.preventDefault(); press(); }
    });
    useButton.addEventListener("keyup", function (e) {
      if (e.key === " " || e.key === "Enter" || e.key === "e" || e.key === "E") { e.preventDefault(); release(); }
    });
    useButton.addEventListener("blur", release);

    // Settings controls
    function showValue(input) {
      var out = input.parentNode.querySelector("output"), v = Number(input.value), name = input.dataset.k;
      if (!out) { return; }
      out.textContent = name === "maxDist" && v === 0 ? "0 (no limit)" : name === "assist" && v === 0 ? "0 (off)" : name === "interval" ? v.toFixed(2) + " s" : String(v);
    }
    function applyMode() {
      app.querySelectorAll("[data-only]").forEach(function (el) { el.hidden = el.dataset.only !== S.mode; });
      // A new sensor drops the input and the hold without an action
      pressed = false;
      useButton.classList.remove("is-down");
      comp.hold = null;
      focus = null; sensorHit = null; sensorAssist = null;
      comp.refreshWait = 0;
      clearTargets();
      if (S.mode === "nearby") { updateOverlaps(); }
      kick();
    }
    app.querySelectorAll("[data-k]").forEach(function (input) {
      var name = input.dataset.k;
      input.value = String(S[name]);
      showValue(input);
      input.addEventListener(input.tagName === "SELECT" ? "change" : "input", function () {
        if (name === "mode") { S.mode = input.value; applyMode(); return; }
        S[name] = Number(input.value);
        showValue(input);
        kick();
      });
    });

    if (window.ResizeObserver) { new ResizeObserver(resize).observe(stage); }
    else { window.addEventListener("resize", resize); }
    pushOut();
    applyMode();
    resize();
  });
})();
