// NsSpyglass showcase: the plugin dependency graph of the Spyglass editor tab, drawn on a canvas.
// The data comes from the table rows of the fragment (data-name, data-depends, and so on).
// Ported from Source/NsSpyglass/Private/Widgets/SNsSpyglassGraphWidget.cpp and SPluginInfoWidget.cpp.
(function () {
  "use strict";
  if (!window.NsShowcase) return;

  // Defaults: Source/NsSpyglass/Private/Settings/NsSpyglassSettings.cpp:6
  // Slider limits: Source/NsSpyglass/Private/NsSpyglass.cpp:60 (MinSliderValue and MaxSliderValue)
  var SETTINGS = [
    { key: "repulsion", label: "Repulsion", min: 100, max: 1000, step: 10, value: 1000, digits: 0 },
    { key: "center", label: "Center Force", min: 0, max: 1, step: 0.01, value: 0.05, digits: 2 },
    { key: "attraction", label: "Attraction Scale", min: 0.1, max: 2, step: 0.05, value: 1, digits: 2 }
  ];
  var BASE_SIZE = 40;       // Node diameter at zoom 1 (SNsSpyglassGraphWidget.cpp:344)
  var INTRO_STAGGER = 0.02; // Source/NsSpyglass/Public/Widgets/SNsSpyglassGraphWidget.h:169
  var INTRO_FADE = 0.25;    // Source/NsSpyglass/Public/Widgets/SNsSpyglassGraphWidget.h:172
  var NUM_STARS = 250;      // SNsSpyglassGraphWidget.cpp:133
  var START_ZOOM = 0.75;    // RecenterView, SNsSpyglassGraphWidget.cpp:580
  var FONT_PX = 13.33;      // Slate NormalFont is 10 pt
  var BG = "#101114";
  var BG_S = 16 / 255;

  // sRGB transfer curve, because Slate colors are linear
  function srgbToLin(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function linToSrgb(c) {
    c = Math.max(0, Math.min(1, c));
    return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }

  // Slate blends in linear light, and the canvas blends in sRGB. This maps a Slate alpha to the canvas alpha that
  // gives about the same result for a light color (sRGB 0.8) on the background. Simplified: one model for all colors.
  var BG_LIN = srgbToLin(BG_S);
  var REF_LIN = srgbToLin(0.8);
  function canvasAlpha(a) {
    if (a <= 0) return 0;
    if (a >= 1) return 1;
    return (linToSrgb(BG_LIN + (REF_LIN - BG_LIN) * a) - BG_S) / (0.8 - BG_S);
  }
  function rgba(lin, a) {
    var c = lin.map(function (v) { return Math.round(linToSrgb(v) * 255); });
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + canvasAlpha(a).toFixed(3) + ")";
  }

  // Engine/Source/Runtime/Core/Private/Math/Color.cpp:411 (FLinearColor::HSVToLinearRGB), hue in degrees
  function hsvToLin(h, s, v) {
    h = ((h % 360) + 360) % 360;
    var fl = Math.floor(h / 60);
    var fr = h / 60 - fl;
    var vals = [v, v * (1 - s), v * (1 - fr * s), v * (1 - (1 - fr) * s)];
    var sw = [[0, 3, 1], [2, 0, 1], [1, 0, 3], [1, 2, 0], [3, 1, 0], [0, 1, 2]][fl % 6];
    return [vals[sw[0]], vals[sw[1]], vals[sw[2]]];
  }

  // Engine/Source/Runtime/Core/Private/Math/Color.cpp:445 (FLinearColor::LerpUsingHSV) toward white (hue 0, S 0, V 1)
  function lerpToWhite(h, s, t) {
    var to = Math.abs(h) > 180 ? 360 : 0; // shortest path to hue 0
    return hsvToLin((h + (to - h) * t) % 360, s * (1 - t), 1);
  }

  function addUnique(list, value) { if (list.indexOf(value) < 0) list.push(value); }
  function words(text) { return (text || "").split(/\s+/).filter(Boolean); }

  function readPlugins(root) {
    return Array.prototype.map.call(root.querySelectorAll("[data-name]"), function (row) {
      var d = row.dataset;
      return {
        name: d.name, friendly: d.friendly || d.name, category: d.category || "Misc", engine: d.engine === "true",
        author: d.author || "", desc: d.desc || "", docs: /^https?:\/\//i.test(d.docs || "") ? d.docs : "",
        modules: words(d.modules).map(function (m) {
          var parts = m.split(":");
          return { name: parts[0], type: parts[1] || "Runtime" };
        }),
        depends: words(d.depends)
      };
    });
  }

  // SNsSpyglassGraphWidget.cpp:52 (BuildNodes): one node per plugin, one color per category, links from the plugin references
  function buildNodes(plugins) {
    var nodes = [];
    var byName = Object.create(null);
    var categories = Object.create(null);
    var count = 0;
    plugins.forEach(function (p) {
      // Hue = Fmod(Index * 50, 360), then a uint8 cast that wraps values over 255 (MSVC behavior)
      if (!(p.category in categories)) categories[p.category] = Math.floor((count++ * 50) % 360) & 255;
      // FLinearColor::MakeFromHSV8(Hue, 160, 255): Color.cpp:375
      var hue = categories[p.category] * 360 / 256;
      var sat = 160 / 255;
      var color = hsvToLin(hue, sat, 1);
      byName[p.name] = nodes.length;
      nodes.push({
        p: p, name: p.name, color: color,
        box: p.engine ? lerpToWhite(hue, sat, 0.3) : color, // lighter fill for engine plugins (cpp:351)
        x: 0, y: 0, vx: 0, vy: 0, links: [], deps: [], dents: [], active: true, alpha: 1, delay: 0, fixed: false
      });
    });
    nodes.forEach(function (n, i) {
      n.p.depends.forEach(function (dep) {
        var j = byName[dep];
        if (j === undefined) return;
        addUnique(n.links, j);
        addUnique(nodes[j].links, i);
        addUnique(n.deps, j);
        addUnique(nodes[j].dents, i);
      });
    });
    // Start on a circle of radius 200 (cpp:115)
    if (nodes.length > 1) {
      nodes.forEach(function (n, i) {
        var angle = 2 * Math.PI / nodes.length * (i - 1);
        n.x = Math.cos(angle) * 200;
        n.y = Math.sin(angle) * 200;
      });
    }
    return nodes;
  }

  // SNsSpyglassGraphWidget.cpp:594 (RunForceAtlas2Step): pair repulsion, edge springs past a rest length,
  // gravity to the origin, damped velocity clamped to 1000 (ClampToMaxSize2D, cpp:695)
  function layoutStep(nodes, repulsion, gravity, attraction, dt, dragging) {
    var num = nodes.length;
    var minDist = 25, restLength = 140, simSpeed = dragging ? 60 : 40;
    var mass = [], fx = [], fy = [];
    var i, j, a, b, dx, dy, d, f;
    if (num <= 1) return;
    for (i = 0; i < num; i++) { mass.push(1 + nodes[i].links.length); fx.push(0); fy.push(0); }
    for (i = 0; i < num; i++) {
      a = nodes[i];
      if (!a.active) continue;
      for (j = i + 1; j < num; j++) {
        b = nodes[j];
        if (!b.active) continue;
        dx = a.x - b.x;
        dy = a.y - b.y;
        d = Math.max(dx * dx + dy * dy, minDist * minDist);
        f = repulsion * mass[i] * mass[j] / d;
        d = Math.sqrt(d);
        fx[i] += dx / d * f; fy[i] += dy / d * f;
        fx[j] -= dx / d * f; fy[j] -= dy / d * f;
      }
      for (j = 0; j < a.links.length; j++) {
        b = nodes[a.links[j]];
        if (!b.active || a.links[j] <= i) continue; // each undirected edge once
        dx = a.x - b.x;
        dy = a.y - b.y;
        d = Math.max(Math.sqrt(dx * dx + dy * dy), minDist);
        f = Math.max(0, d - restLength) * attraction; // edges pull only when stretched
        fx[i] -= dx / d * f; fy[i] -= dy / d * f;
        fx[a.links[j]] += dx / d * f; fy[a.links[j]] += dy / d * f;
      }
    }
    for (i = 0; i < num; i++) {
      a = nodes[i];
      if (!a.active || a.fixed) continue;
      fx[i] -= a.x * gravity * mass[i];
      fy[i] -= a.y * gravity * mass[i];
      a.vx = (a.vx + fx[i] / mass[i] * dt * simSpeed) * 0.9;
      a.vy = (a.vy + fy[i] / mass[i] * dt * simSpeed) * 0.9;
      d = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
      if (d > 1000) { a.vx *= 1000 / d; a.vy *= 1000 / d; }
      a.x += a.vx * dt;
      a.y += a.vy * dt;
    }
  }

  // SNsSpyglassGraphWidget.cpp:199: all dependencies ("deps") or all dependents ("dents") of a node
  function closure(nodes, start, key) {
    var found = [];
    var stack = nodes[start][key].slice();
    stack.forEach(function (k) { found[k] = true; });
    while (stack.length > 0) {
      nodes[stack.pop()][key].forEach(function (k) {
        if (!found[k]) { found[k] = true; stack.push(k); }
      });
    }
    return found;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  window.NsShowcase.register(".ns-spyglass", function (root) {
    var plugins = readPlugins(root);
    if (plugins.length === 0) throw new Error("no plugins");
    var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var settings = {};

    // DOM: the graph on the left, the settings and the info panel on the right (like the editor tab)
    var body = el("div", "ns-spyglass-body");
    var stage = el("div", "ns-spyglass-stage");
    var canvas = el("canvas", "ns-spyglass-canvas");
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label", "Plugin dependency graph. Arrow keys select a plugin, Escape clears it, plus and minus zoom.");
    var tools = el("div", "ns-spyglass-tools");
    var replayButton = tools.appendChild(el("button", "ns-spyglass-button", "Replay"));
    var recenterButton = tools.appendChild(el("button", "ns-spyglass-button", "Recenter"));
    replayButton.type = recenterButton.type = "button";
    stage.appendChild(canvas);
    stage.appendChild(tools);
    var side = el("div", "ns-spyglass-side");
    var controls = side.appendChild(el("div", "ns-spyglass-settings"));
    var info = side.appendChild(el("div", "ns-spyglass-info"));
    info.setAttribute("aria-live", "polite");
    SETTINGS.forEach(function (s) {
      var row = controls.appendChild(el("div", "ns-spyglass-setting"));
      var head = row.appendChild(el("span", "ns-spyglass-setting-head"));
      head.appendChild(el("span", "", s.label));
      var output = head.appendChild(el("output", "ns-spyglass-value", s.value.toFixed(s.digits)));
      var range = row.appendChild(el("input"));
      range.type = "range";
      range.min = String(s.min);
      range.max = String(s.max);
      range.step = String(s.step);
      range.value = String(s.value);
      range.setAttribute("aria-label", s.label);
      settings[s.key] = s.value;
      range.addEventListener("input", function () {
        settings[s.key] = Number(range.value);
        output.textContent = settings[s.key].toFixed(s.digits);
        wake();
      });
    });
    body.appendChild(stage);
    body.appendChild(side);
    var list = root.querySelector(".ns-spyglass-list");
    root.insertBefore(body, list && list.parentNode === root ? list : null);

    var ctx = canvas.getContext("2d");
    var fontFamily = window.getComputedStyle(root).fontFamily || "sans-serif";
    var widthCache = Object.create(null);
    var nodes = [], stars = [];
    var width = 0, height = 0, dpr = 1;
    var zoom = START_ZOOM, offX = 0, offY = 0;
    var userView = false; // true after a pan, a zoom, or a node drag: then the view stops to fit the graph
    var hover = -1, dragNode = -1, panning = false, pointers = {}, pinch = null;
    var introRunning = false, introElapsed = 0;
    var raf = 0, last = 0, calm = 0, visible = false, started = false;

    // SNsSpyglassGraphWidget.cpp:19 (Construct): build the nodes, then fade them in, the nodes with most links first
    function startIntro() {
      nodes = buildNodes(plugins);
      hover = -1;
      zoom = START_ZOOM;
      offX = offY = 0;
      userView = false;
      introRunning = !reduced;
      introElapsed = 0;
      if (reduced) {
        // No intro: run the layout for 10 seconds at 60 fps before the first frame
        for (var k = 0; k < 600; k++) layoutStep(nodes, settings.repulsion * 100, settings.center, settings.attraction, 1 / 60, false);
        fitView(1);
      } else {
        nodes.map(function (n, i) { return i; })
          .sort(function (a, b) { return nodes[b].links.length - nodes[a].links.length; })
          .forEach(function (index, k) {
            nodes[index].delay = k * INTRO_STAGGER;
            nodes[index].active = false;
            nodes[index].alpha = 0;
          });
      }
      updateInfo();
    }

    // SNsSpyglassGraphWidget.cpp:127 (InitStars): random stars over twice the view size
    function placeStar(s) {
      s.x = (Math.random() * 2 - 1) * width;
      s.y = (Math.random() * 2 - 1) * height;
      s.target = 0.2 + Math.random() * 0.8;
      s.speed = 0.5 + Math.random();
      return s;
    }
    function initStars() {
      stars = [];
      for (var i = 0; i < NUM_STARS; i++) {
        var s = placeStar({});
        s.alpha = reduced ? s.target : 0;
        stars.push(s);
      }
    }

    // SNsSpyglassGraphWidget.cpp:708 (Tick): intro fade, one layout step, star fades (FMath::FInterpTo)
    function tick(dt) {
      if (introRunning) {
        introElapsed += dt;
        var shown = 0;
        nodes.forEach(function (n) {
          var a = Math.min(Math.max((introElapsed - n.delay) / INTRO_FADE, 0), 1);
          if (!n.active && a > 0) { n.active = true; n.vx = n.vy = 0; }
          n.alpha = a;
          if (a >= 1) shown++;
        });
        introRunning = shown < nodes.length;
      }
      layoutStep(nodes, settings.repulsion * 100, settings.center, settings.attraction, dt, dragNode >= 0);
      if (reduced) return;
      stars.forEach(function (s) {
        var diff = s.target - s.alpha;
        s.alpha = diff * diff < 1e-8 ? s.target : s.alpha + diff * Math.min(dt * s.speed, 1);
        if (Math.abs(s.alpha - s.target) <= 0.01) {
          if (s.target > 0) s.target = 0;
          else placeStar(s);
        }
      });
    }

    // Not in the editor: until a pan, a zoom, or a drag, the view follows the bounds of the graph (zoom 0.2 to 0.75)
    function fitView(k) {
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      nodes.forEach(function (n) {
        if (!n.active) return;
        minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x);
        minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y);
      });
      if (minX === Infinity || width === 0) return;
      var target = Math.min(width / (maxX - minX + BASE_SIZE * 2), height / (maxY - minY + BASE_SIZE * 2));
      target = Math.min(Math.max(target, 0.2), START_ZOOM);
      zoom += (target - zoom) * k;
      offX += (-(minX + maxX) / 2 * target - offX) * k;
      offY += (-(minY + maxY) / 2 * target - offY) * k;
    }

    function sx(n) { return width / 2 + offX + n.x * zoom; }
    function sy(n) { return height / 2 + offY + n.y * zoom; }

    // SNsSpyglassGraphWidget.cpp:147 (HitTestNode): the first visible node under the point
    function hitTest(px, py) {
      var r = BASE_SIZE * zoom * 0.5;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (n.active && n.alpha >= 0.15 && Math.pow(px - sx(n), 2) + Math.pow(py - sy(n), 2) <= r * r) return i;
      }
      return -1;
    }

    function textWidth(text) {
      if (!(text in widthCache)) {
        ctx.font = FONT_PX + "px " + fontFamily;
        widthCache[text] = ctx.measureText(text).width;
      }
      return widthCache[text];
    }
    function drawText(text, x, y, scale, alpha) {
      if (FONT_PX * scale < 1 || alpha <= 0.01) return;
      ctx.font = (FONT_PX * scale).toFixed(2) + "px " + fontFamily;
      ctx.fillStyle = "rgba(255,255,255," + alpha.toFixed(3) + ")";
      ctx.fillText(text, x, y);
    }
    function line(x1, y1, x2, y2, color, thickness) {
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // SNsSpyglassGraphWidget.cpp:172 (OnPaint): stars, edges, nodes, labels
    function draw() {
      if (width === 0) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);
      // Stars move at one tenth of the pan (parallax)
      stars.forEach(function (s) {
        if (s.alpha <= 0.005) return;
        ctx.fillStyle = "rgba(255,255,255," + canvasAlpha(s.alpha * 0.5).toFixed(3) + ")";
        ctx.fillRect(width / 2 + offX * 0.1 + s.x - 1, height / 2 + offY * 0.1 + s.y - 1, 2, 2);
      });

      var down = hover >= 0 ? closure(nodes, hover, "deps") : [];
      var up = hover >= 0 ? closure(nodes, hover, "dents") : [];
      if (hover >= 0) down[hover] = true;
      var lit = function (k) { return down[k] || up[k]; };
      var r = BASE_SIZE * zoom * 0.5;

      // Edges point from a plugin to its dependency (cpp:257). Lit edges take the plugin color, dim when it is a dependent.
      ctx.lineCap = "round";
      nodes.forEach(function (n, i) {
        if (!n.active || n.alpha <= 0.01) return;
        n.deps.forEach(function (k) {
          var d = nodes[k];
          var edgeAlpha = Math.min(n.alpha, d.alpha);
          if (k === i || !d.active || edgeAlpha <= 0.01) return;
          var dx = sx(d) - sx(n), dy = sy(d) - sy(n);
          var dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          var ux = dx / dist, uy = dy / dist;
          var ex = sx(d) - ux * r, ey = sy(d) - uy * r;
          var lights = hover >= 0 && lit(i) && lit(k);
          var a = lights ? (up[i] ? 0.3 : 1) : 0.05;
          var thickness = lights ? (up[i] ? 2 : 4) : 1;
          line(sx(n) + ux * r, sy(n) + uy * r, ex, ey, rgba(lights ? n.color : [0.5, 0.5, 0.5], a * edgeAlpha), thickness);
          if (!lights) return;
          // The arrowhead takes the color of the dependency
          var arrow = rgba(d.color, a * edgeAlpha);
          var size = 8 * zoom;
          line(ex - ux * size - uy * size * 0.5, ey - uy * size + ux * size * 0.5, ex, ey, arrow, thickness);
          line(ex - ux * size + uy * size * 0.5, ey - uy * size - ux * size * 0.5, ex, ey, arrow, thickness);
        });
      });

      // Nodes grow from 20 % to full size as they fade in (cpp:335). Fill alpha 0.2 down, 0.1 up, 0.05 other.
      nodes.forEach(function (n, i) {
        if (!n.active || n.alpha <= 0.01) return;
        var ease = 1 - Math.pow(1 - n.alpha, 2); // FMath::InterpEaseOut, exponent 2
        var radius = BASE_SIZE * zoom * (0.2 + 0.8 * ease) * 0.5;
        ctx.fillStyle = rgba(n.box, down[i] ? 0.2 : (up[i] ? 0.1 : 0.05));
        ctx.beginPath();
        ctx.arc(sx(n), sy(n), radius, 0, Math.PI * 2);
        ctx.fill();
        if (!lit(i)) return;
        // 4 px outline: full color for dependencies, 0.2 alpha for dependents
        var outline = Math.min(4, radius);
        ctx.strokeStyle = rgba(n.color, up[i] ? 0.2 : 1);
        ctx.lineWidth = outline;
        ctx.beginPath();
        ctx.arc(sx(n), sy(n), Math.max(radius - outline / 2, 0.5), 0, Math.PI * 2);
        ctx.stroke();
      });

      // Labels fit inside the node. Names over 12 letters show their capitals, with the full name below at 60 % (cpp:398).
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var lineHeight = FONT_PX * 1.2;
      nodes.forEach(function (n) {
        if (!n.active || n.alpha <= 0.01) return;
        var textAlpha = Math.min(Math.max(zoom, 0), 1) * n.alpha;
        if (n.name.length <= 12) {
          drawText(n.name, sx(n), sy(n), Math.min(1, (BASE_SIZE - 8) / textWidth(n.name)) * zoom, textAlpha);
          return;
        }
        var short = n.name.replace(/[^A-Z]/g, "") || n.name.slice(0, 2).toUpperCase();
        var base = Math.min(1, (BASE_SIZE - 8) / Math.max(textWidth(short), textWidth(n.name)));
        var total = lineHeight * base * 1.6 * zoom;
        drawText(short, sx(n), sy(n) - total / 2 + lineHeight * base * zoom / 2, base * zoom, textAlpha);
        drawText(n.name, sx(n), sy(n) + total / 2 - lineHeight * base * 0.6 * zoom / 2, base * 0.6 * zoom, textAlpha);
      });

      // Tooltip with the plugin name (cpp:549). Simplified: it sits at the node, not at the pointer.
      if (hover < 0) return;
      var h = nodes[hover];
      ctx.font = "12px " + fontFamily;
      var tw = ctx.measureText(h.name).width + 12;
      var tx = Math.max(Math.min(sx(h) + r + 4, width - tw - 4), 4);
      var ty = Math.max(Math.min(sy(h) + r + 4, height - 26), 4);
      ctx.fillStyle = "rgba(230,230,230,0.95)";
      ctx.fillRect(tx, ty, tw, 22);
      ctx.fillStyle = "#111111";
      ctx.textAlign = "left";
      ctx.fillText(h.name, tx + 6, ty + 11);
    }

    // SPluginInfoWidget.cpp:60 (SetPlugin): name, description, author, docs link, modules, and references
    function updateInfo() {
      info.textContent = "";
      var p = hover >= 0 ? nodes[hover].p : null;
      info.appendChild(el("p", "ns-spyglass-info-name", p ? p.friendly : "Hover a node"));
      if (!p) return;
      if (p.desc) info.appendChild(el("p", "", p.desc));
      info.appendChild(el("p", "", p.author));
      if (p.docs) {
        var link = info.appendChild(el("a", "", "Documentation"));
        link.href = p.docs;
        link.target = "_blank";
        link.rel = "noopener";
      }
      info.appendChild(el("hr"));
      info.appendChild(el("p", "ns-spyglass-info-head", "Modules:"));
      p.modules.forEach(function (m) {
        // Runtime modules are blue (0.2, 0.6, 1), the other types are yellow (1, 1, 0.1)
        var item = info.appendChild(el("p", "ns-spyglass-info-module", m.name));
        item.style.color = rgba(m.type === "Runtime" ? [0.2, 0.6, 1] : [1, 1, 0.1], 1);
        item.title = m.type;
      });
      info.appendChild(el("hr"));
      info.appendChild(el("p", "ns-spyglass-info-head", "Depends on:"));
      p.depends.forEach(function (name) { info.appendChild(el("p", "ns-spyglass-info-module", name)); });
    }

    function setHover(index) {
      if (index === hover) return;
      hover = index;
      updateInfo();
      redraw();
    }

    // The loop sleeps when the nodes move less than 3 px per second for half a second
    function frame(now) {
      raf = 0;
      if (!visible) return;
      var dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
      last = now;
      tick(dt);
      if (!userView) fitView(1 - Math.exp(-dt * 4));
      draw();
      var speed = 0;
      nodes.forEach(function (n) { if (n.active && !n.fixed) speed = Math.max(speed, Math.sqrt(n.vx * n.vx + n.vy * n.vy)); });
      calm = introRunning || dragNode >= 0 || speed * zoom > 3 ? 0 : calm + dt;
      if (calm < 0.5) raf = window.requestAnimationFrame(frame);
    }
    function wake() {
      calm = 0;
      if (raf || !visible || !started) return;
      last = window.performance.now();
      raf = window.requestAnimationFrame(frame);
    }
    function redraw() { if (!raf) draw(); }

    function localPoint(event) {
      var rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    // SNsSpyglassGraphWidget.cpp:562 (OnMouseWheel): zoom around the point, from 0.2 to 10
    function zoomAt(px, py, value) {
      var ratio = Math.min(Math.max(value, 0.2), 10) / zoom;
      zoom *= ratio;
      offX = px - width / 2 - (px - width / 2 - offX) * ratio;
      offY = py - height / 2 - (py - height / 2 - offY) * ratio;
      userView = true;
      redraw();
    }

    function pinchState() {
      var ids = Object.keys(pointers);
      var a = pointers[ids[0]], b = pointers[ids[1]];
      return { dist: Math.max(Math.hypot(a.x - b.x, a.y - b.y), 1), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }

    // SNsSpyglassGraphWidget.cpp:501 (OnMouseButtonUp): a dropped node moves with the layout again
    function releaseDrag() {
      if (dragNode >= 0) {
        nodes[dragNode].fixed = false;
        nodes[dragNode].vx = nodes[dragNode].vy = 0;
      }
      dragNode = -1;
      panning = false;
    }

    // SNsSpyglassGraphWidget.cpp:470 (OnMouseButtonDown): left on a node drags it, left on space or right pans
    canvas.addEventListener("pointerdown", function (event) {
      var p = localPoint(event);
      pointers[event.pointerId] = p;
      try { canvas.setPointerCapture(event.pointerId); } catch (error) { /* the pointer is already gone */ }
      var count = Object.keys(pointers).length;
      if (count === 2) { releaseDrag(); pinch = pinchState(); }
      if (count > 1) return;
      if (event.button === 2) { panning = true; return; }
      if (event.button !== 0) return;
      var hit = hitTest(p.x, p.y);
      if (hit < 0) {
        if (event.pointerType !== "mouse") setHover(-1); // touch has no hover: a tap on space clears the selection
        panning = true;
        return;
      }
      setHover(hit);
      dragNode = hit;
      nodes[hit].fixed = true;
      nodes[hit].vx = nodes[hit].vy = 0;
      userView = true;
      wake();
    });

    // SNsSpyglassGraphWidget.cpp:524 (OnMouseMove): drag, pan, or hover
    canvas.addEventListener("pointermove", function (event) {
      var p = localPoint(event);
      var prev = pointers[event.pointerId];
      if (!prev) {
        if (event.pointerType === "mouse") setHover(hitTest(p.x, p.y));
        return;
      }
      pointers[event.pointerId] = p;
      if (pinch && Object.keys(pointers).length === 2) {
        var next = pinchState();
        offX += next.x - pinch.x;
        offY += next.y - pinch.y;
        zoomAt(next.x, next.y, zoom * next.dist / pinch.dist);
        pinch = next;
      } else if (dragNode >= 0) {
        nodes[dragNode].x += (p.x - prev.x) / zoom;
        nodes[dragNode].y += (p.y - prev.y) / zoom;
        wake();
      } else if (panning) {
        offX += p.x - prev.x;
        offY += p.y - prev.y;
        userView = true;
        redraw();
      }
    });

    function pointerEnd(event) {
      if (!pointers[event.pointerId]) return;
      delete pointers[event.pointerId];
      if (Object.keys(pointers).length < 2) pinch = null;
      releaseDrag();
      wake();
    }
    canvas.addEventListener("pointerup", pointerEnd);
    canvas.addEventListener("pointercancel", pointerEnd);
    canvas.addEventListener("contextmenu", function (event) { event.preventDefault(); });

    // One wheel notch (100 px) is one Slate wheel step: zoom times 1.1
    canvas.addEventListener("wheel", function (event) {
      event.preventDefault();
      var p = localPoint(event);
      var steps = Math.min(Math.max(-event.deltaY / (event.deltaMode === 1 ? 3 : 100), -3), 3);
      zoomAt(p.x, p.y, zoom * Math.pow(1.1, steps));
    }, { passive: false });

    canvas.addEventListener("keydown", function (event) {
      var key = event.key;
      if (key === "ArrowRight" || key === "ArrowDown") setHover((hover + 1) % nodes.length);
      else if (key === "ArrowLeft" || key === "ArrowUp") setHover(hover <= 0 ? nodes.length - 1 : hover - 1);
      else if (key === "Escape") setHover(-1);
      else if (key === "+" || key === "=") zoomAt(width / 2, height / 2, zoom * 1.1);
      else if (key === "-" || key === "_") zoomAt(width / 2, height / 2, zoom / 1.1);
      else return;
      event.preventDefault();
    });

    replayButton.addEventListener("click", function () {
      startIntro();
      if (!reduced) wake();
      redraw();
    });

    // RecenterView (cpp:577). Here it fits the graph again.
    recenterButton.addEventListener("click", function () {
      userView = false;
      if (!reduced) return wake();
      fitView(1);
      redraw();
    });

    function resize() {
      var w = Math.round(stage.clientWidth);
      var h = Math.round(Math.max(280, Math.min(520, w * 0.62)));
      if (w === width && h === height) return;
      width = w;
      height = h;
      dpr = window.devicePixelRatio || 1;
      canvas.style.height = h + "px";
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      initStars();
      if (!userView && !raf) fitView(1);
      redraw();
    }

    // The intro starts when the graph first comes into view
    function show(isVisible) {
      visible = isVisible;
      if (visible && !started) {
        started = true;
        startIntro();
      }
      if (visible && !reduced) wake();
      redraw();
    }

    nodes = buildNodes(plugins);
    nodes.forEach(function (n) { n.active = false; n.alpha = 0; });
    updateInfo();
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
    else window.addEventListener("resize", resize);
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) { show(entries[entries.length - 1].isIntersecting); }).observe(canvas);
    } else {
      show(true);
    }
  });
})();
