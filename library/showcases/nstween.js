// NsTween showcase: an easing playground. It draws the curve of an ENsTweenEase preset and moves a box with it.
// The math and the loop rules are ports of the NsTween C++ source (paths above each function).
(function () {
  "use strict";

  if (!window.NsShowcase) {
    return;
  }

  // UE_SMALL_NUMBER and UE_KINDA_SMALL_NUMBER, the tolerances that the plugin uses
  var SMALL_NUMBER = 1e-8;
  var KINDA_SMALL_NUMBER = 1e-4;
  var PI = Math.PI;
  var SAMPLES = 241;

  function clamp(value, low, high) {
    return value < low ? low : (value > high ? high : value);
  }

  // FMath::IsNearlyZero and FMath::IsNearlyEqual with their default tolerance
  function nearlyZero(value) {
    return Math.abs(value) <= SMALL_NUMBER;
  }

  function nearlyOne(value) {
    return Math.abs(value - 1) <= SMALL_NUMBER;
  }

  // Source/NsTween/Private/Easing/NsTweenPolynomialEasing.cpp:6
  function easeOutBounce(t) {
    var n1 = 7.5625;
    var d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    }
    if (t < 2 / d1) {
      t -= 1.5 / d1;
      return n1 * t * t + 0.75;
    }
    if (t < 2.5 / d1) {
      t -= 2.25 / d1;
      return n1 * t * t + 0.9375;
    }
    t -= 2.625 / d1;
    return n1 * t * t + 0.984375;
  }

  // Source/NsTween/Private/Easing/NsTweenPolynomialEasing.cpp:35 (one entry for each case of the switch)
  var PRESETS = {
    Linear: function (x) { return x; },
    InSine: function (x) { return 1 - Math.cos((x * PI) * 0.5); },
    OutSine: function (x) { return Math.sin((x * PI) * 0.5); },
    InOutSine: function (x) { return -0.5 * (Math.cos(PI * x) - 1); },
    InQuad: function (x) { return x * x; },
    OutQuad: function (x) { return 1 - (1 - x) * (1 - x); },
    InOutQuad: function (x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) * 0.5; },
    InCubic: function (x) { return x * x * x; },
    OutCubic: function (x) { return 1 - Math.pow(1 - x, 3); },
    InOutCubic: function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) * 0.5; },
    InQuart: function (x) { return x * x * x * x; },
    OutQuart: function (x) { return 1 - Math.pow(1 - x, 4); },
    InOutQuart: function (x) { return x < 0.5 ? 8 * Math.pow(x, 4) : 1 - Math.pow(-2 * x + 2, 4) * 0.5; },
    InQuint: function (x) { return Math.pow(x, 5); },
    OutQuint: function (x) { return 1 - Math.pow(1 - x, 5); },
    InOutQuint: function (x) { return x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) * 0.5; },
    InExpo: function (x) { return nearlyZero(x) ? 0 : Math.pow(2, 10 * x - 10); },
    OutExpo: function (x) { return nearlyOne(x) ? 1 : 1 - Math.pow(2, -10 * x); },
    InOutExpo: function (x) {
      if (nearlyZero(x)) { return 0; }
      if (nearlyOne(x)) { return 1; }
      if (x < 0.5) { return Math.pow(2, 20 * x - 10) * 0.5; }
      return (2 - Math.pow(2, -20 * x + 10)) * 0.5;
    },
    InCirc: function (x) { return 1 - Math.sqrt(1 - x * x); },
    OutCirc: function (x) { return Math.sqrt(1 - Math.pow(x - 1, 2)); },
    InOutCirc: function (x) {
      return x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) * 0.5
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) * 0.5;
    },
    InElastic: function (x) {
      if (nearlyZero(x)) { return 0; }
      if (nearlyOne(x)) { return 1; }
      var c = (2 * PI) / 3;
      return -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c);
    },
    OutElastic: function (x) {
      if (nearlyZero(x)) { return 0; }
      if (nearlyOne(x)) { return 1; }
      var c = (2 * PI) / 3;
      return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c) + 1;
    },
    InOutElastic: function (x) {
      if (nearlyZero(x)) { return 0; }
      if (nearlyOne(x)) { return 1; }
      var c = (2 * PI) / 4.5;
      if (x < 0.5) {
        return -0.5 * Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c);
      }
      return Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c) * 0.5 + 1;
    },
    InBounce: function (x) { return 1 - easeOutBounce(1 - x); },
    OutBounce: function (x) { return easeOutBounce(x); },
    InOutBounce: function (x) {
      return x < 0.5
        ? (1 - easeOutBounce(1 - 2 * x)) * 0.5
        : (1 + easeOutBounce(2 * x - 1)) * 0.5;
    },
    InBack: function (x) {
      var c1 = 1.70158;
      var c3 = c1 + 1;
      return c3 * x * x * x - c1 * x * x;
    },
    OutBack: function (x) {
      var c1 = 1.70158;
      var c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    InOutBack: function (x) {
      var c1 = 1.70158;
      var c2 = c1 * 1.525;
      if (x < 0.5) {
        return Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2) * 0.5;
      }
      return (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) * 0.5;
    }
  };

  // Source/NsTween/Private/Easing/NsTweenPolynomialEasing.cpp:37 clamps the input. An unknown name falls to the Linear default.
  function makePreset(name) {
    var ease = PRESETS[name] || PRESETS.Linear;
    return function (t) {
      return ease(clamp(t, 0, 1));
    };
  }

  // Source/NsTween/Private/Easing/NsTweenBezierEasing.cpp:9 (Evaluate, SampleCurveX, SampleCurveY, SampleDerivativeX, Solve)
  // Source/NsTween/Public/Easing/NsTweenBezierEasing.h:25 (Epsilon and NewtonIterations)
  function makeBezier(p) {
    var epsilon = 1e-6;
    var newtonIterations = 8;

    function sampleX(t) {
      var u = 1 - t;
      return 3 * u * u * t * p[0] + 3 * u * t * t * p[2] + t * t * t;
    }

    function sampleY(t) {
      var u = 1 - t;
      return 3 * u * u * t * p[1] + 3 * u * t * t * p[3] + t * t * t;
    }

    function derivativeX(t) {
      var u = 1 - t;
      return 3 * u * u * p[0] + 6 * u * t * (p[2] - p[0]) + 3 * t * t * (1 - p[2]);
    }

    function solve(x) {
      var t = x;
      for (var i = 0; i < newtonIterations; i++) {
        var currentX = sampleX(t) - x;
        if (Math.abs(currentX) < epsilon) {
          return t;
        }
        var derivative = derivativeX(t);
        if (Math.abs(derivative) < epsilon) {
          break;
        }
        t = clamp(t - currentX / derivative, 0, 1);
      }

      // Bisection, when Newton does not converge
      var lower = 0;
      var upper = 1;
      t = x;
      while (upper - lower > epsilon) {
        var sampled = sampleX(t);
        if (Math.abs(sampled - x) < epsilon) {
          break;
        }
        if (sampled < x) {
          lower = t;
        } else {
          upper = t;
        }
        t = 0.5 * (lower + upper);
      }
      return t;
    }

    return function (t) {
      return sampleY(solve(clamp(t, 0, 1)));
    };
  }

  // Source/NsTween/Private/NsTweenAsyncAction.cpp:86 and NsTweenBuilder.cpp:108 (SetLoops clamps the count to 0 or more)
  // Source/NsTween/Private/NsTweenBuilder.cpp:71 (UpdateWrapMode: ping-pong first, then loop, else once)
  function wrapFor(loops, pingPong) {
    var count = Math.max(loops, 0);
    if (pingPong) {
      return { mode: "PingPong", count: count };
    }
    if (count !== 0) {
      return { mode: "Loop", count: count };
    }
    return { mode: "Once", count: 0 };
  }

  // Source/NsTween/Private/NsTween.cpp:16 (constructor, Forward direction, no delay)
  function makeTween(duration, wrap, ease) {
    return {
      duration: Math.max(duration, SMALL_NUMBER),
      mode: wrap.mode,
      count: wrap.count,
      ease: ease,
      cycleTime: 0,
      forward: true,
      cycles: 0,
      pairs: 0,
      active: true,
      linear: 0,
      value: 0,
      onLoop: 0,
      onPingPong: 0,
      onComplete: 0
    };
  }

  // Source/NsTween/Private/NsTween.cpp:152 (Apply)
  function apply(tween, cycleTime) {
    tween.linear = clamp(cycleTime / tween.duration, 0, 1);
    tween.value = tween.ease(tween.linear);
  }

  // Strategy->ApplyFinal and OnComplete: the value jumps to the end value
  function finish(tween) {
    tween.linear = 1;
    tween.value = 1;
    tween.onComplete += 1;
    tween.active = false;
  }

  // Source/NsTween/Private/NsTween.cpp:172 (HandleBoundary)
  function handleBoundary(tween) {
    if (tween.mode === "Once") {
      finish(tween);
      return;
    }
    if (tween.mode === "Loop") {
      tween.cycles += 1;
      tween.onLoop += 1;
      if (tween.count > 0 && tween.cycles >= tween.count) {
        finish(tween);
        return;
      }
      tween.cycleTime = 0;
      tween.forward = true;
      return;
    }
    tween.forward = !tween.forward;
    tween.onPingPong += 1;
    if (!tween.forward) {
      tween.pairs += 1;
    } else if (tween.count > 0 && tween.pairs >= tween.count) {
      finish(tween);
      return;
    }
    tween.cycleTime = tween.forward ? 0 : tween.duration;
  }

  // Source/NsTween/Private/NsTween.cpp:35 (Tick, with a time scale of 1 and no delay)
  function tick(tween, deltaSeconds) {
    if (!tween.active || deltaSeconds <= SMALL_NUMBER) {
      return;
    }
    var remaining = deltaSeconds;
    var duration = tween.duration;
    while (remaining > SMALL_NUMBER && tween.active) {
      var target = tween.forward ? duration : 0;
      var toBoundary = tween.forward ? target - tween.cycleTime : tween.cycleTime - target;
      var safe = toBoundary > 0 ? toBoundary : 0;
      if (remaining <= safe + KINDA_SMALL_NUMBER) {
        tween.cycleTime = clamp(tween.cycleTime + (tween.forward ? remaining : -remaining), 0, duration);
        apply(tween, tween.cycleTime);
        break;
      }
      remaining -= safe;
      tween.cycleTime = target;
      apply(tween, tween.cycleTime);
      handleBoundary(tween);
    }
  }

  function describeWrap(wrap) {
    if (wrap.mode === "Once") {
      return "Wrap Mode Once: one pass, then OnComplete.";
    }
    if (wrap.mode === "Loop") {
      return "Wrap Mode Loop, Loop Count " + wrap.count + ": " + wrap.count + (wrap.count === 1 ? " pass" : " passes") + " from the start.";
    }
    if (wrap.count === 0) {
      return "Wrap Mode PingPong, Loop Count 0: no end.";
    }
    return "Wrap Mode PingPong, Loop Count " + wrap.count + ": " + wrap.count + (wrap.count === 1 ? " pair" : " pairs") + ", then the end value.";
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

  window.NsShowcase.register(".ns-ease", function (root) {
    var list = root.querySelector("ul");
    if (!list || !list.querySelector("[data-ease]")) {
      throw new Error("no easing presets");
    }
    var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // The stage: one canvas with the curve on top and the moving box below
    var view = make("div", "ns-ease-view");
    var canvas = make("canvas", "ns-ease-canvas");
    canvas.setAttribute("role", "img");
    var context = canvas.getContext("2d");
    view.appendChild(canvas);

    // The controls of the Tween Float node and their defaults: Source/NsTween/Public/NsTweenAsyncAction.h:192
    var controls = make("div", "ns-ease-controls");
    controls.innerHTML =
      '<label class="ns-ease-field"><span>Duration Secs</span><input type="range" min="0.1" max="3" step="0.1" value="1" aria-label="Duration Secs"><output>1.0</output></label>' +
      '<label class="ns-ease-field"><span>Loops</span><input type="number" min="-3" max="10" step="1" value="0" aria-label="Loops"></label>' +
      '<label class="ns-ease-field"><input type="checkbox" aria-label="Ping Pong"><span>Ping Pong</span></label>' +
      '<button type="button" class="ns-ease-play">Play</button>';
    view.appendChild(controls);
    var durationInput = controls.querySelector('input[type="range"]');
    var durationOutput = controls.querySelector("output");
    var loopsInput = controls.querySelector('input[type="number"]');
    var pingPongInput = controls.querySelector('input[type="checkbox"]');
    var playButton = controls.querySelector("button");

    var status = make("p", "ns-ease-status");
    var wrapLine = make("span");
    var eventLine = make("span");
    status.appendChild(wrapLine);
    status.appendChild(eventLine);
    view.appendChild(status);
    root.insertBefore(view, list);

    // Turn each preset of the list into a button. Each row keeps its family name.
    var buttons = [];
    Array.prototype.slice.call(list.children).forEach(function (row) {
      var items = row.querySelectorAll("[data-ease]");
      if (items.length === 0) {
        return;
      }
      var family = row.querySelector("b");
      var familyName = family ? family.textContent.trim() : "";
      var chips = make("span", "ns-ease-chips");
      Array.prototype.forEach.call(items, function (item) {
        var name = item.getAttribute("data-ease");
        var label = item.getAttribute("data-label") || name.replace(familyName, "") || name;
        var button = make("button", "ns-ease-chip", label);
        button.type = "button";
        button.setAttribute("aria-label", name);
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("data-ease", name);
        if (item.hasAttribute("data-bezier")) {
          button.setAttribute("data-bezier", item.getAttribute("data-bezier"));
        }
        button.addEventListener("click", function () {
          select(button, true);
        });
        buttons.push(button);
        chips.appendChild(button);
      });
      row.textContent = "";
      if (family) {
        row.appendChild(family);
      }
      row.appendChild(chips);
    });

    var current = null;
    var ease = makePreset("Linear");
    var samples = [];
    var low = 0;
    var high = 1;
    var tween = null;
    var frameId = 0;
    var lastTime = 0;
    var width = 0;
    var height = 0;
    var pixelRatio = 0;

    function easeFor(button) {
      var name = button.getAttribute("data-ease");
      if (name === "CustomBezier") {
        // FNsTweenSpec default points: Source/NsTween/Public/NsTweenTypeLibrary.h:126
        var points = (button.getAttribute("data-bezier") || "0.25,0.1,0.25,1.0").split(",").map(Number);
        return makeBezier(points);
      }
      return makePreset(name);
    }

    // Sample the curve one time for each preset, and find the value range (Back and Elastic go past 0 and 1)
    function sampleCurve() {
      samples = [];
      low = 0;
      high = 1;
      for (var i = 0; i < SAMPLES; i++) {
        var value = ease(i / (SAMPLES - 1));
        samples.push(value);
        low = Math.min(low, value);
        high = Math.max(high, value);
      }
      var pad = (high - low) * 0.08;
      low -= pad;
      high += pad;
    }

    function readWrap() {
      var loops = Math.round(Number(loopsInput.value)) || 0;
      return wrapFor(loops, pingPongInput.checked);
    }

    function updateText() {
      durationOutput.textContent = Number(durationInput.value).toFixed(1);
      wrapLine.textContent = describeWrap(readWrap());
      var t = tween || { onLoop: 0, onPingPong: 0, onComplete: 0 };
      eventLine.textContent = "OnLoop " + t.onLoop + ", OnPingPong " + t.onPingPong + ", OnComplete " + t.onComplete;
    }

    function line(x1, y1, x2, y2) {
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    }

    function draw() {
      if (!width) {
        return;
      }
      var left = 30;
      var top = 14;
      var trackHeight = 56;
      var graphWidth = width - left - 14;
      var graphHeight = height - top - trackHeight - 10;
      var range = high - low;
      var px = function (t) { return left + t * graphWidth; };
      var py = function (v) { return top + (high - v) / range * graphHeight; };
      var tx = function (v) { return left + (v - low) / range * graphWidth; };

      context.clearRect(0, 0, width, height);
      context.font = '11px "Overpass Mono", monospace';
      context.lineWidth = 1;

      // The lines of the start value (0) and the end value (1)
      context.strokeStyle = "#666666";
      context.fillStyle = "#989898";
      context.textAlign = "right";
      context.textBaseline = "middle";
      context.setLineDash([4, 4]);
      [0, 1].forEach(function (v) {
        line(px(0), py(v), px(1), py(v));
        context.fillText(String(v), left - 8, py(v));
      });
      context.setLineDash([]);
      context.strokeStyle = "rgba(255, 255, 255, 0.08)";
      line(px(0), top, px(0), top + graphHeight);
      line(px(1), top, px(1), top + graphHeight);

      // The curve
      context.strokeStyle = "#f03a6c";
      context.lineWidth = 2;
      context.beginPath();
      samples.forEach(function (v, i) {
        var x = px(i / (SAMPLES - 1));
        if (i === 0) {
          context.moveTo(x, py(v));
        } else {
          context.lineTo(x, py(v));
        }
      });
      context.stroke();

      var alpha = tween ? tween.linear : 0;
      var value = tween ? tween.value : 0;

      // The time marker and the dot on the curve
      if (tween) {
        context.lineWidth = 1;
        context.strokeStyle = "rgba(255, 255, 255, 0.25)";
        line(px(alpha), top, px(alpha), top + graphHeight);
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(px(alpha), py(value), 5, 0, 2 * PI);
        context.fill();
      }

      // The track: the box sits at the eased value, between the start and the end marks
      var trackY = top + graphHeight + 10 + trackHeight / 2;
      context.lineWidth = 1;
      context.strokeStyle = "#666666";
      line(left, trackY, left + graphWidth, trackY);
      context.fillStyle = "#989898";
      context.textAlign = "center";
      context.textBaseline = "top";
      [[0, "Start"], [1, "End"]].forEach(function (mark) {
        line(tx(mark[0]), trackY - 12, tx(mark[0]), trackY + 12);
        context.fillText(mark[1], tx(mark[0]), trackY + 15);
      });
      context.fillStyle = "#f03a6c";
      context.fillRect(tx(value) - 8, trackY - 8, 16, 16);
    }

    function stop() {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      frameId = 0;
      lastTime = 0;
      playButton.textContent = "Play";
    }

    function frame(now) {
      // A long gap (a hidden tab) counts as one tenth of a second
      var delta = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
      lastTime = now;
      tick(tween, delta);
      draw();
      updateText();
      if (tween.active) {
        frameId = requestAnimationFrame(frame);
      } else {
        frameId = 0;
        stop();
      }
    }

    function play() {
      stop();
      tween = makeTween(Number(durationInput.value) || 1, readWrap(), ease);
      playButton.textContent = "Stop";
      updateText();
      frameId = requestAnimationFrame(frame);
    }

    function select(button, fromUser) {
      current = button;
      ease = easeFor(button);
      buttons.forEach(function (other) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });
      canvas.setAttribute("aria-label", "Curve of " + button.getAttribute("data-ease") + ". The box below moves with the eased value.");
      sampleCurve();
      if (fromUser && !reduceMotion) {
        play();
        return;
      }
      stop();
      tween = null;
      updateText();
      draw();
    }

    playButton.addEventListener("click", function () {
      if (frameId) {
        stop();
      } else {
        play();
      }
    });

    durationInput.addEventListener("input", updateText);
    // A builder option applies only before the tween starts, so a change starts a new tween
    [durationInput, loopsInput, pingPongInput].forEach(function (input) {
      input.addEventListener("change", function () {
        updateText();
        if (frameId) {
          play();
        }
      });
    });

    // Two columns when the widget is wide, one column when it is narrow. Redraw when the canvas width changes.
    function resize() {
      root.classList.toggle("ns-ease-wide", root.clientWidth >= 640);
      var cssWidth = canvas.clientWidth;
      var ratio = window.devicePixelRatio || 1;
      if (!cssWidth || (cssWidth === width && ratio === pixelRatio)) {
        return;
      }
      width = cssWidth;
      pixelRatio = ratio;
      height = Math.round(clamp(cssWidth * 0.6, 220, 300));
      canvas.style.height = height + "px";
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    }

    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(root);
    } else {
      window.addEventListener("resize", resize);
    }

    var startName = root.getAttribute("data-start");
    var first = buttons.filter(function (button) {
      return button.getAttribute("data-ease") === startName;
    })[0] || buttons[0];
    select(first, false);
    resize();

    // Draw again when the mono font is ready, because the canvas labels use it
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(draw);
    }

    // Play one pass when the widget comes into view, but not with reduced motion
    if (!reduceMotion && window.IntersectionObserver) {
      var watcher = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          watcher.disconnect();
          if (!tween && current) {
            play();
          }
        }
      }, { threshold: 0.5 });
      watcher.observe(canvas);
    }
  });
})();
