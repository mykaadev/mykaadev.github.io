// NsVehicles showcase: the standard powertrain RPM, the automatic gearbox, and the interior gauges.
// Speed is an input here. The widget does not simulate the vehicle physics.
// Fragment: <figure class="ns-gearbox"><table><tr data-key="gear-ratios"><td>Name</td><td>3.8, 2.4</td></tr>...</table></figure>
(function () {
  "use strict";

  if (!window.NsShowcase) {
    return;
  }

  var STEP = 1 / 60; // Fixed tick in seconds
  var SMALL_NUMBER = 1e-8; // UE_SMALL_NUMBER
  var SWEEP_SECONDS = 12; // One sweep goes from 0 to the top speed and back

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

  // Unreal Engine FMath::GetMappedRangeValueClamped
  function mapClamped(inRange, outRange, value) {
    var pct = clamp((value - inRange[0]) / (inRange[1] - inRange[0]), 0, 1);
    return outRange[0] + (outRange[1] - outRange[0]) * pct;
  }

  // The gearbox state of UNsVehicleTransmissionComponent
  // Source/NsVehicle/Public/Modules/Powertrain/NsVehicleTransmissionComponent.h:127
  function Transmission(cfg) {
    this.gearRatios = cfg.gearRatios;
    this.upshiftRatio = clamp(cfg.upshiftRatio, 0, 1);
    this.downshiftRatio = clamp(cfg.downshiftRatio, 0, 1);
    this.shiftDelay = cfg.shiftDelay;
    this.automatic = true;
    this.lockShift = false;
    this.currentGear = 0;
    this.activeGearRatio = 3;
    this.isUpshifting = false;
    this.isDownshifting = false;
    this.upshiftFrameCount = 0;
    this.downshiftFrameCount = 0;
  }

  // Source/NsVehicle/Private/Modules/Powertrain/NsVehicleTransmissionComponent.cpp:75
  Transmission.prototype.shift = function (upshift) {
    if (upshift) {
      if (this.currentGear + 1 < this.gearRatios.length && (!this.isUpshifting || this.isDownshifting)) {
        this.isUpshifting = true;
        this.currentGear++;
      }
    } else if (this.currentGear - 1 >= 0 && (this.isUpshifting || !this.isDownshifting)) {
      this.isDownshifting = true;
      this.currentGear--;
    }
  };

  // Source/NsVehicle/Private/Modules/Powertrain/NsVehicleTransmissionComponent.cpp:150
  Transmission.prototype.updateActiveGearRatio = function () {
    this.activeGearRatio = this.gearRatios.length === 0 ? 3.5 : this.gearRatios[this.currentGear];
    return this.activeGearRatio;
  };

  // Source/NsVehicle/Private/Modules/Powertrain/NsVehicleTransmissionComponent.cpp:156
  // RPM-based shifting only. The vehicle is on the ground, so the gearbox can always shift.
  Transmission.prototype.updateAutomaticShift = function (rpm, maxRpm) {
    var upshiftCondition = rpm > maxRpm * this.upshiftRatio;
    var downshiftCondition = rpm < maxRpm * this.downshiftRatio;
    if (!this.automatic || this.lockShift || this.gearRatios.length === 1) {
      return;
    }
    if (upshiftCondition) {
      this.shift(true);
    }
    if (downshiftCondition) {
      this.shift(false);
    }
  };

  // Source/NsVehicle/Private/Modules/Powertrain/NsVehicleTransmissionComponent.cpp:186
  Transmission.prototype.updateShiftTimers = function (deltaTime) {
    if (this.isUpshifting) {
      this.upshiftFrameCount++;
      if (this.upshiftFrameCount * deltaTime > this.shiftDelay) {
        this.isUpshifting = false;
      }
    } else {
      this.upshiftFrameCount = 0;
    }
    if (this.isDownshifting) {
      this.downshiftFrameCount++;
      if (this.downshiftFrameCount * deltaTime > this.shiftDelay) {
        this.isDownshifting = false;
      }
    } else {
      this.downshiftFrameCount = 0;
    }
  };

  // Source/NsVehicle/Private/Modules/Powertrain/NsVehicleEngineComponent.cpp:141 (the branch on the ground)
  function wheelRpmOf(gearRatio, differentialRatio, wheelRadius, linearVelocity, rpmMultiplier) {
    // The order of operations matches the plugin, so 60 / 2 * PI stays as written
    return gearRatio * differentialRatio * linearVelocity * wheelRadius * (60 / 2 * Math.PI) * rpmMultiplier;
  }

  function updateStandardRpm(rpm, deltaTime, wheelRpm, maxRpm) {
    var interpSpeed = 15;
    return clamp(interpTo(rpm, wheelRpm, deltaTime, interpSpeed), -maxRpm, maxRpm);
  }

  // One interior part, for example the tachometer needle
  // Source/NsVehicle/Private/Interior/NsVehicleInteriorComponent.cpp:12
  function Gauge(inputRange, outputRange, smoothingSpeed) {
    this.inputRange = inputRange;
    this.outputRange = outputRange;
    this.smoothingSpeed = smoothingSpeed;
    this.useSmoothing = false;
    this.invert = false;
    this.rotation = 0;
  }

  Gauge.prototype.update = function (deltaTime, driveValue) {
    var direction = this.invert ? -1 : 1;
    var targetRotation = mapClamped(this.inputRange, this.outputRange, direction * driveValue);
    this.rotation = this.useSmoothing ? interpTo(this.rotation, targetRotation, deltaTime, this.smoothingSpeed) : targetRotation;
  };

  // Reads the numbers of one table row: <tr data-key="key"><td>Name</td><td>1, 2, 3</td></tr>
  function readRow(root, key, fallback) {
    var row = root.querySelector('tr[data-key="' + key + '"]');
    var cells = row ? row.querySelectorAll("td") : [];
    var text = cells.length > 1 ? cells[cells.length - 1].textContent : "";
    var found = text.match(/-?\d+(\.\d+)?/g);
    return found ? found.map(Number) : fallback;
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

  // Draws one round gauge. The needle angle is the rotation of the interior part: 0 at the lower left, clockwise.
  function drawGauge(canvas, gauge, view) {
    var size = canvas.clientWidth;
    if (!size) {
      return;
    }
    var ratio = window.devicePixelRatio || 1;
    var pixels = Math.round(size * ratio);
    if (canvas.width !== pixels) {
      canvas.width = pixels;
      canvas.height = pixels;
    }
    var ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, size, size);

    var cx = size / 2;
    var cy = size / 2;
    var radius = size * 0.42;
    var span = gauge.outputRange[1] - gauge.outputRange[0];
    function angleOf(rotation) {
      return (135 + rotation - gauge.outputRange[0]) * Math.PI / 180;
    }
    function rotationOf(value) {
      return mapClamped(gauge.inputRange, gauge.outputRange, value);
    }
    function arc(from, to, color, width) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.arc(cx, cy, radius, angleOf(from), angleOf(to));
      ctx.stroke();
    }

    var line = Math.max(2, size * 0.014);
    arc(gauge.outputRange[0], gauge.outputRange[0] + span, "#2a2b30", line);
    view.zones.forEach(function (zone) {
      arc(rotationOf(zone[0]), rotationOf(zone[1]), zone[2], line * 2.2);
    });

    // Ticks and labels
    ctx.fillStyle = "#989898";
    ctx.font = Math.max(9, Math.round(size * 0.055)) + 'px "Overpass Mono", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (var i = 0; i <= view.ticks; i++) {
      var value = gauge.inputRange[0] + (gauge.inputRange[1] - gauge.inputRange[0]) * i / view.ticks;
      var angle = angleOf(rotationOf(value));
      ctx.beginPath();
      ctx.strokeStyle = "#666666";
      ctx.lineWidth = Math.max(1, size * 0.008);
      ctx.moveTo(cx + Math.cos(angle) * radius * 0.86, cy + Math.sin(angle) * radius * 0.86);
      ctx.lineTo(cx + Math.cos(angle) * radius * 0.96, cy + Math.sin(angle) * radius * 0.96);
      ctx.stroke();
      ctx.fillText(String(Math.round(value / view.labelScale)), cx + Math.cos(angle) * radius * 0.72, cy + Math.sin(angle) * radius * 0.72);
    }

    // The text goes in the gap at the bottom, where the needle never points
    ctx.fillStyle = "#ffffff";
    ctx.font = Math.round(size * 0.13) + 'px "Overpass Mono", monospace';
    ctx.fillText(view.center, cx, cy + radius * 0.42);
    ctx.fillStyle = "#989898";
    ctx.font = Math.max(10, Math.round(size * 0.055)) + 'px "Overpass Mono", monospace';
    ctx.fillText(view.unit, cx, cy + radius * 0.72);

    // Needle
    var needle = angleOf(gauge.rotation);
    ctx.beginPath();
    ctx.strokeStyle = "#f03a6c";
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(2, size * 0.016);
    ctx.moveTo(cx - Math.cos(needle) * radius * 0.12, cy - Math.sin(needle) * radius * 0.12);
    ctx.lineTo(cx + Math.cos(needle) * radius * 0.92, cy + Math.sin(needle) * radius * 0.92);
    ctx.stroke();
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.fillStyle = "#f03a6c";
    ctx.arc(cx, cy, Math.max(3, size * 0.025), 0, Math.PI * 2);
    ctx.fill();
  }

  NsShowcase.register(".ns-gearbox", function (root) {
    var tach = readRow(root, "tachometer", [0, 7000, 0, 270]);
    var speedo = readRow(root, "speedometer", [0, 200, 0, 270]);
    var cfg = {
      gearRatios: readRow(root, "gear-ratios", []),
      differentialRatio: readRow(root, "differential-ratio", [3.05])[0],
      wheelRadius: Math.max(readRow(root, "wheel-radius", [0.28])[0], SMALL_NUMBER),
      maxRpm: Math.max(0, readRow(root, "max-rpm", [7000])[0]),
      upshiftRatio: readRow(root, "upshift-ratio", [0.85])[0],
      downshiftRatio: readRow(root, "downshift-ratio", [0.3])[0],
      shiftDelay: readRow(root, "shift-delay", [0.2])[0],
      smoothingSpeed: readRow(root, "smoothing-speed", [5])[0]
    };
    if (tach.length < 4 || speedo.length < 4) {
      throw new Error("gauge ranges missing");
    }
    var speedMax = Number(root.dataset.speedMax) || 250;

    var transmission = new Transmission(cfg);
    var tachometer = new Gauge([tach[0], tach[1]], [tach[2], tach[3]], cfg.smoothingSpeed);
    var speedometer = new Gauge([speedo[0], speedo[1]], [speedo[2], speedo[3]], cfg.smoothingSpeed);
    var speedKph = clamp(Number(root.dataset.speedStart) || 0, 0, speedMax);
    var rpm = 0;
    var wheelRpm = 0;

    // Build the view
    var view = el("div", "ns-gearbox-view");
    var gauges = el("div", "ns-gearbox-gauges");
    var tachCanvas = el("canvas");
    var speedoCanvas = el("canvas");
    tachCanvas.setAttribute("role", "img");
    speedoCanvas.setAttribute("role", "img");
    gauges.appendChild(tachCanvas);
    gauges.appendChild(speedoCanvas);

    var controls = el("div", "ns-gearbox-controls");
    var speedLabel = el("label", "ns-gearbox-speed");
    var speedText = el("span", "", "Speed (input)");
    var speedOut = el("output", "ns-gearbox-out");
    var range = el("input");
    range.type = "range";
    range.min = "0";
    range.max = String(speedMax);
    range.step = "1";
    range.value = String(speedKph);
    speedLabel.appendChild(speedText);
    speedLabel.appendChild(speedOut);
    speedLabel.appendChild(range);

    var buttons = el("div", "ns-gearbox-buttons");
    var downButton = el("button", "", "Downshift");
    var upButton = el("button", "", "Upshift");
    var sweepButton = el("button", "", "Sweep");
    [downButton, upButton, sweepButton].forEach(function (button) {
      button.type = "button";
      buttons.appendChild(button);
    });
    sweepButton.setAttribute("aria-pressed", "false");

    function checkbox(text, checked) {
      var label = el("label", "ns-gearbox-check");
      var input = el("input");
      input.type = "checkbox";
      input.checked = checked;
      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + text));
      controls.appendChild(label);
      return input;
    }

    controls.appendChild(speedLabel);
    controls.appendChild(buttons);
    var autoBox = checkbox("Automatic", true);
    var smoothBox = checkbox("Use Smoothing on the needles", false);

    var readout = el("dl", "ns-gearbox-readout");
    function readoutRow(name) {
      readout.appendChild(el("dt", "", name));
      var value = el("dd");
      readout.appendChild(value);
      return value;
    }
    var gearOut = readoutRow("Gear");
    var wheelOut = readoutRow("Wheel RPM (target)");
    var rpmOut = readoutRow("Engine RPM");
    var shiftOut = readoutRow("Shift points");
    var stateOut = readoutRow("Gearbox");
    shiftOut.textContent = "down below " + Math.round(cfg.maxRpm * transmission.downshiftRatio) + ", up above " + Math.round(cfg.maxRpm * transmission.upshiftRatio) + " RPM";

    view.appendChild(gauges);
    view.appendChild(controls);
    view.appendChild(readout);
    root.insertBefore(view, root.querySelector("table"));

    // One tick, in the order of ANsVehicle::UpdateStandardPowertrain
    // Source/NsVehicle/Private/Vehicle/NsVehicle.cpp:384
    function tick() {
      var gearRatio = transmission.updateActiveGearRatio();
      transmission.updateAutomaticShift(rpm, cfg.maxRpm);
      // GetSpeedKPH is the speed in m/s times 3.6 (NsVehicle.cpp:240)
      wheelRpm = wheelRpmOf(gearRatio, cfg.differentialRatio, cfg.wheelRadius, speedKph / 3.6, 1);
      rpm = updateStandardRpm(rpm, STEP, wheelRpm, cfg.maxRpm);
      transmission.updateShiftTimers(STEP);
      // Tachometer: engine RPM (NsVehicleTachometerComponent.cpp:14). Speedometer: KPH (NsVehicleSpeedometerComponent.cpp:13)
      tachometer.update(STEP, rpm);
      speedometer.update(STEP, speedKph);
    }

    function signature() {
      return [rpm, transmission.currentGear, transmission.isUpshifting, transmission.isDownshifting, tachometer.rotation, speedometer.rotation].join();
    }

    function draw() {
      var gear = transmission.currentGear + 1;
      var state = transmission.isUpshifting ? "upshift" : transmission.isDownshifting ? "downshift" : transmission.automatic ? "automatic" : "manual";
      speedOut.textContent = Math.round(speedKph) + " KPH";
      gearOut.textContent = gear + " (ratio " + transmission.activeGearRatio + ")";
      wheelOut.textContent = String(Math.round(wheelRpm));
      rpmOut.textContent = String(Math.round(rpm));
      stateOut.textContent = state;
      drawGauge(tachCanvas, tachometer, {
        zones: [[0, cfg.maxRpm * transmission.downshiftRatio, "#4a4b52"], [cfg.maxRpm * transmission.upshiftRatio, tachometer.inputRange[1], "rgba(240,58,108,0.45)"]],
        ticks: 7,
        labelScale: 1000,
        center: String(gear),
        unit: "gear, " + Math.round(rpm) + " RPM"
      });
      drawGauge(speedoCanvas, speedometer, {
        zones: [],
        ticks: 5,
        labelScale: 1,
        center: String(Math.round(speedKph)),
        unit: "KPH"
      });
      tachCanvas.setAttribute("aria-label", "Tachometer: " + Math.round(rpm) + " RPM, gear " + gear);
      speedoCanvas.setAttribute("aria-label", "Speedometer: " + Math.round(speedKph) + " KPH");
    }

    // Animation loop. It stops when nothing changes.
    var running = false;
    var lastTime = 0;
    var carry = 0;
    var idleFrames = 0;
    var sweepTime = -1;

    function setSweep(on) {
      sweepTime = on ? 0 : -1;
      sweepButton.setAttribute("aria-pressed", on ? "true" : "false");
      sweepButton.textContent = on ? "Stop" : "Sweep";
    }

    function frame(now) {
      var elapsed = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
      lastTime = now;
      if (sweepTime >= 0) {
        sweepTime += elapsed;
        var phase = sweepTime / SWEEP_SECONDS;
        speedKph = speedMax * (phase < 0.5 ? phase * 2 : Math.max(0, 2 - phase * 2));
        range.value = String(Math.round(speedKph));
        if (phase >= 1) {
          speedKph = 0;
          setSweep(false);
        }
      }
      var before = signature();
      carry += elapsed;
      while (carry >= STEP) {
        carry -= STEP;
        tick();
      }
      draw();
      var busy = signature() !== before || sweepTime >= 0 || transmission.isUpshifting || transmission.isDownshifting;
      idleFrames = busy ? 0 : idleFrames + 1;
      if (idleFrames > 3) {
        running = false;
        return;
      }
      requestAnimationFrame(frame);
    }

    function wake() {
      idleFrames = 0;
      if (!running) {
        running = true;
        lastTime = 0;
        requestAnimationFrame(frame);
      }
    }

    range.addEventListener("input", function () {
      setSweep(false);
      speedKph = Number(range.value);
      wake();
    });
    // Upshift and Downshift: NsVehicleTransmissionComponent.cpp:65 and :70
    upButton.addEventListener("click", function () {
      transmission.shift(true);
      wake();
    });
    downButton.addEventListener("click", function () {
      transmission.shift(false);
      wake();
    });
    sweepButton.addEventListener("click", function () {
      setSweep(sweepTime < 0);
      wake();
    });
    autoBox.addEventListener("change", function () {
      transmission.automatic = autoBox.checked;
      wake();
    });
    smoothBox.addEventListener("change", function () {
      tachometer.useSmoothing = smoothBox.checked;
      speedometer.useSmoothing = smoothBox.checked;
      wake();
    });

    // Settle the start state at once, with no animation
    for (var i = 0; i < 600; i++) {
      tick();
    }
    draw();

    if (window.ResizeObserver) {
      new ResizeObserver(draw).observe(gauges);
    } else {
      window.addEventListener("resize", draw);
    }
    // The gauge text uses the site font, which can load after the first draw
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(draw);
    }
  });
})();
