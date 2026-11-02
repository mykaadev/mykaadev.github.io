// Glitch entry on the About page: the card with no readable name or role.
// Like the vault cards, it glitches now and then, and nonstop while the pointer is on it. Each burst scrambles every line.
// Easter egg: keep the pointer on the card and the page slowly closes in, shakes and glitches.
(function () {
  if (window.__mykaaGlitchEntryInitialized) {
    return;
  }
  window.__mykaaGlitchEntryInitialized = true;

  var entries = Array.prototype.slice.call(document.querySelectorAll(".glitch-entry"));
  if (entries.length === 0) {
    return;
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var noise = "#%&@$?!*/\\|<>=+~_";
  var blocks = "█▓▒░";
  var lines = ["SIGNAL LOST", "NO DATA", "ERR", "NULL", "0x00", "????", "▓▓▓▓▓▓"];
  var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  // Swap a share of the letters for noise and blocks; heavy bursts go further
  function corrupt(text, amount) {
    var chars = text.split("");
    var slots = [];
    chars.forEach(function (char, index) {
      if (char !== " ") {
        slots.push(index);
      }
    });
    var hits = Math.max(1, Math.round(slots.length * amount));
    for (var i = 0; i < hits && slots.length > 0; i++) {
      var index = slots.splice(Math.floor(Math.random() * slots.length), 1)[0];
      chars[index] = Math.random() < 0.5 ? pick(noise.split("")) : pick(blocks.split(""));
    }
    return chars.join("");
  }

  // data-noise sets how much of a line stays corrupted; a burst always goes past it
  function noiseOf(element) {
    return Number(element.getAttribute("data-noise")) || 0.1;
  }

  // A line with data-random has no real text: only a shuffle of letters and symbols, about data-length long
  function gibberish(element) {
    var pool = (letters + noise + blocks).split("");
    var base = Number(element.getAttribute("data-length")) || 7;
    var length = base - 1 + Math.floor(Math.random() * 3);
    var text = "";
    for (var i = 0; i < length; i++) {
      text += pick(pool);
    }
    return text;
  }

  function scramble(element) {
    if (element.hasAttribute("data-random")) {
      return gibberish(element);
    }
    // Deep into the easter egg, a line with data-whisper starts to say something else
    var whisper = element.getAttribute("data-whisper");
    if (whisper && level > 0.55 && Math.random() < 0.45) {
      return corrupt(whisper, 0.08);
    }
    var clean = element.getAttribute("data-clean") || element.textContent;
    var noise = noiseOf(element);
    var roll = Math.random();
    if (roll < 0.12 + noise * 0.4 && clean.length < 20) {
      return pick(lines);
    }
    return corrupt(clean, Math.max(noise + 0.1, roll < 0.5 ? 0.15 : 0.4));
  }

  function setText(element, text) {
    element.textContent = text;
    element.setAttribute("data-text", text);
  }

  function glitch(entry) {
    if (entry.classList.contains("is-glitching")) {
      return;
    }

    var texts = Array.prototype.slice.call(entry.querySelectorAll(".glitch-text"));
    var resting = texts.map(function (element) {
      return element.textContent;
    });

    entry.classList.add("is-glitching");
    var swaps = 2 + Math.floor(Math.random() * 4);
    var step = 0;
    var timer = window.setInterval(function () {
      step++;
      if (step > swaps) {
        window.clearInterval(timer);
        // Rest on a lightly corrupted text, so the card never reads fully clean
        texts.forEach(function (element, index) {
          var clean = element.getAttribute("data-clean");
          if (element.hasAttribute("data-random")) {
            setText(element, gibberish(element));
          } else {
            setText(element, clean ? corrupt(clean, noiseOf(element)) : resting[index]);
          }
        });
        entry.classList.remove("is-glitching");
        if (entry.__glitchHovered) {
          window.setTimeout(function () {
            if (entry.__glitchHovered) {
              glitch(entry);
            }
          }, 80 + Math.random() * 300);
        }
        return;
      }
      texts.forEach(function (element) {
        setText(element, scramble(element));
      });
    }, 90);
  }

  if (!reduceMotion) {
    entries.forEach(function (entry) {
      entry.addEventListener("pointerenter", function () {
        entry.__glitchHovered = true;
        glitch(entry);
      });
      entry.addEventListener("pointerleave", function () {
        entry.__glitchHovered = false;
      });
    });

    // One burst every 5 seconds; hovering keeps it going nonstop (see pointerenter above)
    window.setInterval(function () {
      if (!document.hidden) {
        entries.forEach(function (entry) {
          if (!entry.__glitchHovered) {
            glitch(entry);
          }
        });
      }
    }, 5000);
  }

  // ---- Easter egg ----------------------------------------------------------
  // The dark closes in around the pointer, the page drains of color and sways,
  // and the card starts to talk.

  var DREAD_DELAY = 1; // seconds on the card before anything happens
  var DREAD_RAMP = 9; // seconds from the first sign to full strength
  var DREAD_RELEASE = 4; // seconds to fade from full strength back to normal

  var body = document.body;
  var overlay = null;
  var vignette = null;
  var hoverStart = null;
  var level = 0;
  var running = false;
  var lastFrame = 0;
  var pointerX = 50;
  var pointerY = 50;

  document.addEventListener("pointermove", function (event) {
    pointerX = (event.clientX / window.innerWidth) * 100;
    pointerY = (event.clientY / window.innerHeight) * 100;
  });

  function buildOverlay() {
    overlay = document.createElement("div");
    overlay.className = "nulled-dread-overlay";
    overlay.setAttribute("aria-hidden", "true");
    vignette = document.createElement("div");
    vignette.className = "nulled-dread-vignette";
    overlay.appendChild(vignette);
    body.appendChild(overlay);
  }

  // An inverted frame or a black frame, gone almost before it is seen
  function flash() {
    var kind = Math.random() < 0.65 ? "nulled-flash" : "nulled-blackout";
    body.classList.add(kind);
    entries.forEach(glitch);
    window.setTimeout(function () {
      body.classList.remove(kind);
    }, 40 + Math.random() * 90);
  }

  // Two quick beats, then a rest, faster as the level grows
  function heartbeat(now) {
    var period = 1500 - level * 600;
    var t = (now % period) / period;
    var beat = Math.max(0, 1 - Math.abs(t - 0.08) * 14) + 0.7 * Math.max(0, 1 - Math.abs(t - 0.26) * 14);
    return beat;
  }

  function apply(now) {
    var beat = heartbeat(now);
    // The clear hole around the pointer shrinks with the level and pulls tighter on each beat
    var radius = 55 - level * 42 - beat * level * 5;
    vignette.style.setProperty("--vx", pointerX.toFixed(1) + "%");
    vignette.style.setProperty("--vy", pointerY.toFixed(1) + "%");
    vignette.style.setProperty("--vr", Math.max(6, radius).toFixed(1) + "%");
    vignette.style.opacity = Math.min(1, level * 1.3).toFixed(3);

    body.style.setProperty("--dread-gray", (level * 0.85).toFixed(3));
    body.style.setProperty("--dread-bright", (1 - level * 0.35).toFixed(3));

    if (!reduceMotion) {
      // A slow, heavy sway, a tremor that grows, and a rare hard jolt
      var amp = level * 4;
      var tremor = level * level * 2.5;
      var x = Math.sin(now / 900) * amp + Math.sin(now / 370) * amp * 0.3 + (Math.random() - 0.5) * tremor;
      var y = Math.cos(now / 1100) * amp * 0.6 + (Math.random() - 0.5) * tremor;
      var r = Math.sin(now / 1300) * level * 0.5;
      if (Math.random() < level * 0.012) {
        x += (Math.random() < 0.5 ? -1 : 1) * (8 + level * 10);
      }
      body.style.setProperty("--dread-x", x.toFixed(2) + "px");
      body.style.setProperty("--dread-y", y.toFixed(2) + "px");
      body.style.setProperty("--dread-r", r.toFixed(3) + "deg");
      if (Math.random() < level * level * 0.025) {
        flash();
      }
    }
  }

  function stop() {
    running = false;
    body.classList.remove("nulled-dread", "nulled-flash", "nulled-blackout");
    ["--dread-x", "--dread-y", "--dread-r", "--dread-gray", "--dread-bright"].forEach(function (name) {
      body.style.removeProperty(name);
    });
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  function frame(now) {
    var dt = lastFrame ? (now - lastFrame) / 1000 : 0;
    lastFrame = now;

    if (hoverStart !== null) {
      var held = (now - hoverStart) / 1000;
      level = Math.max(level, Math.min(1, (held - DREAD_DELAY) / DREAD_RAMP));
    } else {
      // Let go, and it slowly lets go of you
      level = Math.max(0, level - dt / DREAD_RELEASE);
    }

    if (level > 0) {
      if (!overlay) {
        buildOverlay();
        body.classList.add("nulled-dread");
      }
      apply(now);
    }

    if (level <= 0 && hoverStart === null) {
      stop();
      return;
    }
    window.requestAnimationFrame(frame);
  }

  entries.forEach(function (entry) {
    entry.addEventListener("pointerenter", function () {
      if (hoverStart === null) {
        hoverStart = performance.now();
      }
      if (!running) {
        running = true;
        lastFrame = 0;
        window.requestAnimationFrame(frame);
      }
    });
    entry.addEventListener("pointerleave", function () {
      hoverStart = null;
    });
  });
})();
