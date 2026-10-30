// NsVoice showcase: the talk level and the speech state of the plugin, driven by a synthetic microphone level.
// It uses no microphone and no audio API.
// Fragment: <figure class="ns-voice"><table><tr data-key="talk-rise-speed"><td>Name</td><td>18</td>...</tr></table></figure>
(function () {
  "use strict";

  if (!window.NsShowcase) {
    return;
  }

  var STEP = 1 / 60; // Fixed tick in seconds
  var SMALL_NUMBER = 1e-8; // UE_SMALL_NUMBER
  var HISTORY_SECONDS = 4;
  var FRAME_SECONDS = 0.02; // One Opus frame: 20 ms (NsVoiceChatComponent.h:86)
  var SVG = "http://www.w3.org/2000/svg";

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  // Unreal Engine FMath::FInterpTo (Core/Public/Math/UnrealMathUtility.h)
  function interpTo(current, target, deltaTime, speed) {
    if (speed <= 0) {
      return target;
    }
    var dist = target - current;
    if (dist * dist < SMALL_NUMBER) {
      return target;
    }
    return current + dist * clamp(deltaTime * speed, 0, 1);
  }

  // Synthetic voice: about 4.6 syllables each second, and a short pause after each word. It is not a recording.
  function syntheticPeak(time, loudness) {
    var syllable = Math.max(0, Math.sin(time * 2 * Math.PI * 4.6));
    var word = time % 1.6 < 1.35 ? 1 : 0.05;
    var jitter = 0.85 + 0.15 * Math.sin(time * 37.1) * Math.sin(time * 13.3);
    return loudness * Math.sqrt(syllable) * word * jitter;
  }

  // Reads the number of one table row: <tr data-key="key"><td>Name</td><td>18</td>...</tr>
  function readRow(root, key, fallback) {
    var row = root.querySelector('tr[data-key="' + key + '"]');
    var cells = row ? row.querySelectorAll("td") : [];
    var found = cells.length > 1 ? cells[1].textContent.match(/-?\d+(\.\d+)?/) : null;
    return found ? Number(found[0]) : fallback;
  }

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

  function svg(tag, attributes) {
    var node = document.createElementNS(SVG, tag);
    Object.keys(attributes).forEach(function (name) {
      node.setAttribute(name, String(attributes[name]));
    });
    return node;
  }

  // A simple face. Its mouth opens with the talk level.
  function makePerson(name) {
    var box = el("div", "ns-voice-person");
    var face = svg("svg", { viewBox: "0 0 100 100", "aria-hidden": "true", focusable: "false" });
    face.appendChild(svg("circle", { cx: 50, cy: 50, r: 44, "class": "ns-voice-head" }));
    face.appendChild(svg("circle", { cx: 35, cy: 40, r: 4, "class": "ns-voice-eye" }));
    face.appendChild(svg("circle", { cx: 65, cy: 40, r: 4, "class": "ns-voice-eye" }));
    var mouth = svg("ellipse", { cx: 50, cy: 68, rx: 16, ry: 1.5, "class": "ns-voice-mouth" });
    face.appendChild(mouth);
    var title = el("b", "", name);
    var level = el("span", "ns-voice-value");
    var light = el("span", "ns-voice-light", "Is Speaking");
    box.appendChild(face);
    box.appendChild(title);
    box.appendChild(level);
    box.appendChild(light);
    return { box: box, mouth: mouth, level: level, light: light };
  }

  function slider(label, min, max, step, value) {
    var box = el("label", "ns-voice-slider");
    var out = el("output", "ns-voice-value");
    var input = el("input");
    input.type = "range";
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(value);
    box.appendChild(el("span", "", label));
    box.appendChild(out);
    box.appendChild(input);
    return { box: box, input: input, out: out };
  }

  NsShowcase.register(".ns-voice", function (root) {
    var cfg = {
      gain: clamp(readRow(root, "gain", 1.5), 0, 4),
      talkRiseSpeed: Math.max(0.1, readRow(root, "talk-rise-speed", 18)),
      talkFallSpeed: Math.max(0.1, readRow(root, "talk-fall-speed", 6)),
      remoteLevelGain: Math.max(0, readRow(root, "remote-level-gain", 10)),
      framesPerPacket: clamp(readRow(root, "frames-per-packet", 2), 1, 5),
      levelHoldSeconds: Math.max(0.05, readRow(root, "level-hold-seconds", 0.15)),
      speechLevel: clamp(readRow(root, "speech-level", 0.12), 0.01, 1),
      speechHoldSeconds: Math.max(0, readRow(root, "speech-hold-seconds", 0.4)),
      heardScale: readRow(root, "heard-scale", 0.1)
    };
    var packetSeconds = cfg.framesPerPacket * FRAME_SECONDS;
    var historySize = Math.round(HISTORY_SECONDS / STEP);

    // Simulation state
    var time = 0;
    var transmitting = false;
    var talkStart = 0;
    var loudness = clamp(Number(root.dataset.loudness) || 0.3, 0, 1);
    var micLevel = 0;
    var speakerTalk = 0;
    var listenerTalk = 0;
    var lastLoudTime = -100;
    var speaking = false;
    var shownSpeaking = false;
    var packetPeak = 0;
    var packetClock = 0;
    var lastPeak = 0;
    var lastPacketTime = -100;
    var history = [];

    // Build the view
    var view = el("div", "ns-voice-view");
    var controls = el("div", "ns-voice-controls");
    var talkButton = el("button", "ns-voice-talk", "Hold to talk");
    talkButton.type = "button";
    talkButton.setAttribute("aria-pressed", "false");
    talkButton.setAttribute("aria-label", "Talk. Hold the button, or hold Space or Enter.");
    var loudSlider = slider("Voice loudness (synthetic)", 0, 1, 0.01, loudness);
    var gainSlider = slider("Gain", 0, 4, 0.1, cfg.gain);
    controls.appendChild(talkButton);
    controls.appendChild(loudSlider.box);
    controls.appendChild(gainSlider.box);

    var canvas = el("canvas", "ns-voice-trace");
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Levels of the last " + HISTORY_SECONDS + " seconds");
    var legend = el("ul", "ns-voice-legend");
    [["mic", "Microphone level"], ["speaker", "Talk level, speaker"], ["listener", "Talk level, listener"], ["threshold", "Speech Level"], ["speaking", "Is Speaking"]].forEach(function (item) {
      var entry = el("li", "ns-voice-key-" + item[0], item[1]);
      legend.appendChild(entry);
    });

    var people = el("div", "ns-voice-people");
    var speaker = makePerson("Speaker");
    var listener = makePerson("Listener");
    people.appendChild(speaker.box);
    people.appendChild(listener.box);
    var logBox = el("div", "ns-voice-logbox");
    logBox.appendChild(el("b", "", "On Speaking Changed"));
    var log = el("ol", "ns-voice-log");
    log.setAttribute("aria-live", "polite");
    logBox.appendChild(log);
    people.appendChild(logBox);

    view.appendChild(controls);
    view.appendChild(canvas);
    view.appendChild(legend);
    view.appendChild(people);
    root.insertBefore(view, root.querySelector("table"));

    // UNsVoiceActivityComponent::OnRep_Speaking: the event fires one time for each change
    // NsVoice/Source/NsVoice/Private/NsVoiceActivityComponent.cpp:54
    function onRepSpeaking() {
      if (shownSpeaking === speaking) {
        return;
      }
      shownSpeaking = speaking;
      var entry = el("li", "", time.toFixed(2) + " s: " + (speaking ? "true" : "false"));
      log.insertBefore(entry, log.firstChild);
      while (log.children.length > 4) {
        log.removeChild(log.lastChild);
      }
    }

    // One game tick of the speaker and of one listener
    function tick() {
      time += STEP;

      // Speaker: UNsMicSubsystem::GetLevel is the block peak times the gain (NsMicSubsystem.cpp:88)
      micLevel = transmitting ? clamp(syntheticPeak(time - talkStart, loudness) * cfg.gain, 0, 1) : 0;

      // Speaker: TickOwner gives the level to the activity component (NsVoiceChatComponent.cpp:89)
      // UNsVoiceActivityComponent::SetLocalMicLevel (NsVoiceActivityComponent.cpp:21)
      if (transmitting && micLevel >= cfg.speechLevel) {
        lastLoudTime = time;
      }

      // Speaker: SendMicrophone sends one packet for each Frames Per Packet frames (NsVoiceChatComponent.cpp:113)
      // Listener: PlayPacket keeps the peak and the time of the latest packet (NsVoiceChatComponent.cpp:182)
      if (transmitting) {
        packetPeak = Math.max(packetPeak, micLevel);
        packetClock += STEP;
        if (packetClock >= packetSeconds) {
          packetClock -= packetSeconds;
          lastPeak = packetPeak * cfg.heardScale;
          lastPacketTime = time;
          packetPeak = 0;
        }
      } else {
        packetPeak = 0;
        packetClock = 0;
      }

      // GetRawTalkLevel (NsVoiceChatComponent.cpp:78). The speaker reads its microphone.
      // The speaker does not play its own packets, so with a closed microphone its raw level is 0.
      var speakerRaw = transmitting ? clamp(micLevel, 0, 1) : 0;
      // A listener reads GetVoiceLevel (NsVoiceChatComponent.cpp:73) times Remote Level Gain
      var voiceLevel = time - lastPacketTime <= cfg.levelHoldSeconds ? lastPeak : 0;
      var listenerRaw = clamp(voiceLevel * cfg.remoteLevelGain, 0, 1);

      // The smoothing of TickComponent (NsVoiceChatComponent.cpp:31)
      speakerTalk = interpTo(speakerTalk, speakerRaw, STEP, speakerRaw > speakerTalk ? cfg.talkRiseSpeed : cfg.talkFallSpeed);
      listenerTalk = interpTo(listenerTalk, listenerRaw, STEP, listenerRaw > listenerTalk ? cfg.talkRiseSpeed : cfg.talkFallSpeed);

      // UNsVoiceActivityComponent::TickComponent (NsVoiceActivityComponent.cpp:29)
      var loud = time - lastLoudTime <= cfg.speechHoldSeconds;
      if (loud !== speaking) {
        speaking = loud;
        onRepSpeaking();
      }

      history.push([micLevel, speakerTalk, listenerTalk, speaking]);
      if (history.length > historySize) {
        history.shift();
      }
      return transmitting || speaking || speakerTalk > 0 || listenerTalk > 0 || voiceLevel > 0;
    }

    function drawTrace() {
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      if (!width || !height) {
        return;
      }
      var ratio = window.devicePixelRatio || 1;
      if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
      }
      var ctx = canvas.getContext("2d");
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var top = 14;
      var bottom = height - 4;
      function x(index) {
        return width - (history.length - 1 - index) * width / (historySize - 1);
      }
      function y(level) {
        return bottom - level * (bottom - top);
      }

      // The speech band at the top
      ctx.fillStyle = "rgba(240, 58, 108, 0.35)";
      for (var i = 0; i < history.length; i++) {
        if (history[i][3]) {
          ctx.fillRect(x(i) - width / historySize, 2, width / historySize + 1, 6);
        }
      }

      // The Speech Level line
      ctx.strokeStyle = "#666666";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, y(cfg.speechLevel));
      ctx.lineTo(width, y(cfg.speechLevel));
      ctx.stroke();
      ctx.setLineDash([]);

      [[0, "#666666", 1.5], [2, "rgba(255, 255, 255, 0.8)", 2], [1, "#f03a6c", 2.5]].forEach(function (series) {
        ctx.strokeStyle = series[1];
        ctx.lineWidth = series[2];
        ctx.beginPath();
        for (var j = 0; j < history.length; j++) {
          var px = x(j);
          var py = y(history[j][series[0]]);
          if (j === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      });
    }

    function drawPerson(person, level) {
      person.mouth.setAttribute("ry", (1.5 + level * 14).toFixed(2));
      person.mouth.setAttribute("rx", (16 - level * 4).toFixed(2));
      person.level.textContent = "Get Talk Level " + level.toFixed(2);
      person.light.setAttribute("data-on", speaking ? "true" : "false");
    }

    function draw() {
      loudSlider.out.textContent = loudness.toFixed(2);
      gainSlider.out.textContent = cfg.gain.toFixed(1);
      drawPerson(speaker, speakerTalk);
      drawPerson(listener, listenerTalk);
      drawTrace();
    }

    // Animation loop. It stops after the trace is quiet for its full width.
    var running = false;
    var lastFrame = 0;
    var carry = 0;
    var quietTicks = 0;

    function frame(now) {
      var elapsed = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
      lastFrame = now;
      carry += elapsed;
      while (carry >= STEP) {
        carry -= STEP;
        quietTicks = tick() ? 0 : quietTicks + 1;
      }
      draw();
      if (quietTicks > historySize) {
        running = false;
        return;
      }
      requestAnimationFrame(frame);
    }

    function wake() {
      quietTicks = 0;
      if (!running) {
        running = true;
        lastFrame = 0;
        requestAnimationFrame(frame);
      }
    }

    // Push to talk: SetTransmitting(true) opens the microphone, SetTransmitting(false) closes it
    function setTalk(on) {
      if (on === transmitting) {
        return;
      }
      transmitting = on;
      talkStart = time;
      talkButton.setAttribute("aria-pressed", on ? "true" : "false");
      talkButton.textContent = on ? "Talking" : "Hold to talk";
      wake();
    }

    talkButton.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) {
        return;
      }
      event.preventDefault();
      talkButton.focus();
      try {
        talkButton.setPointerCapture(event.pointerId);
      } catch (error) {
        // Without the capture, pointerup on the button still ends the talk
      }
      setTalk(true);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (name) {
      talkButton.addEventListener(name, function () {
        setTalk(false);
      });
    });
    talkButton.addEventListener("keydown", function (event) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setTalk(true);
      }
    });
    talkButton.addEventListener("keyup", function (event) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setTalk(false);
      }
    });
    talkButton.addEventListener("blur", function () {
      setTalk(false);
    });
    talkButton.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    loudSlider.input.addEventListener("input", function () {
      loudness = Number(loudSlider.input.value);
      draw();
    });
    gainSlider.input.addEventListener("input", function () {
      cfg.gain = Number(gainSlider.input.value);
      draw();
    });

    for (var i = 0; i < historySize; i++) {
      history.push([0, 0, 0, false]);
    }
    draw();

    if (window.ResizeObserver) {
      new ResizeObserver(drawTrace).observe(canvas);
    } else {
      window.addEventListener("resize", drawTrace);
    }
  });
})();
