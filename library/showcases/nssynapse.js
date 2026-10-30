// NsSynapse showcase: utility AI scores. Sliders set the inputs, and each action shows its score and the terms of the score.
// The score math and the choice rule are ports of the NsSynapse C++ source (paths above each function).
(function () {
  "use strict";

  if (!window.NsShowcase) {
    return;
  }

  var SVG_NS = "http://www.w3.org/2000/svg";
  var CURVE_WIDTH = 64;
  var CURVE_HEIGHT = 40;
  var CURVE_PAD = 4;

  // Default curve of a consideration: Source/NsSynapse/Private/Classes/NsSynapseConsideration.cpp:9 (keys (0, 0) and (1, 1))
  var DEFAULT_KEYS = [{ time: 0, value: 0 }, { time: 1, value: 1 }];

  function clamp(value, low, high) {
    return value < low ? low : (value > high ? high : value);
  }

  // "0,0 0.5,0.6 1,0" becomes a list of keys, sorted by time
  function parseKeys(text) {
    return String(text).trim().split(/\s+/).map(function (pair) {
      var parts = pair.split(",");
      return { time: Number(parts[0]), value: Number(parts[1]) };
    }).filter(function (key) {
      return isFinite(key.time) && isFinite(key.value);
    }).sort(function (a, b) {
      return a.time - b.time;
    });
  }

  // FRichCurve::Eval of the engine, simplified to linear keys: the value of the first key before it,
  // the value of the last key after it, and a straight line between two keys. No keys gives 0.
  function evalCurve(keys, x) {
    if (keys.length === 0) {
      return 0;
    }
    var last = keys[keys.length - 1];
    if (x <= keys[0].time) {
      return keys[0].value;
    }
    if (x >= last.time) {
      return last.value;
    }
    for (var i = 1; i < keys.length; i++) {
      var next = keys[i];
      if (x < next.time) {
        var previous = keys[i - 1];
        var span = next.time - previous.time;
        return span > 0 ? previous.value + (next.value - previous.value) * (x - previous.time) / span : next.value;
      }
    }
    return last.value;
  }

  // Source/NsSynapse/Private/Classes/NsSynapseConsideration.cpp:16 (GetScore: clamp the raw score to 0..1, then evaluate the curve)
  // An unknown input gives 0, as CalculateScore_Implementation does (NsSynapseConsideration.cpp:28)
  function considerationScore(consideration, inputs) {
    var raw = Object.prototype.hasOwnProperty.call(inputs, consideration.input) ? inputs[consideration.input] : 0;
    var x = clamp(raw, 0, 1);
    return { x: x, curve: evalCurve(consideration.keys, x) };
  }

  // Source/NsSynapse/Private/Classes/NsSynapseBrainComponent.cpp:48 (ScoreAction)
  function scoreAction(action, inputs) {
    var count = action.considerations.length;
    if (count === 0) {
      // NsSynapseBrainComponent.cpp:59: no considerations gives a score of 1
      return { score: 1, factor: 0, terms: [] };
    }

    // NsSynapseBrainComponent.cpp:67: ModificationFactor = 1 - 1/N
    var factor = 1 - 1 / count;
    var combined = 1;
    var terms = action.considerations.map(function (consideration) {
      var sample = considerationScore(consideration, inputs);
      // NsSynapseBrainComponent.cpp:85 to 90: clamp, make-up term, product
      var normalized = clamp(sample.curve, 0, 1);
      var makeUp = (1 - normalized) * factor;
      var finalScore = normalized + makeUp * normalized;
      combined *= finalScore;
      return { x: sample.x, curve: normalized, finalScore: finalScore };
    });
    return { score: combined, factor: factor, terms: terms };
  }

  // Source/NsSynapse/Private/Classes/NsSynapseBrainComponent.cpp:14 (ChooseAction)
  // The best score starts at 0 and must be strictly greater: a tie keeps the first action, and all scores of 0 give no action.
  function chooseAction(results) {
    var best = -1;
    var bestScore = 0;
    results.forEach(function (result, index) {
      if (result.score > bestScore) {
        bestScore = result.score;
        best = index;
      }
    });
    return best;
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

  function makeSvg(tag, attributes) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attributes).forEach(function (name) {
      node.setAttribute(name, attributes[name]);
    });
    return node;
  }

  function curveX(x) {
    return CURVE_PAD + x * (CURVE_WIDTH - 2 * CURVE_PAD);
  }

  // The plot shows the clamped value, because the brain clamps the curve result to 0..1
  function curveY(value) {
    return CURVE_HEIGHT - CURVE_PAD - clamp(value, 0, 1) * (CURVE_HEIGHT - 2 * CURVE_PAD);
  }

  // A small plot of a response curve, with a dot at the current input
  function makeCurvePlot(keys) {
    var svg = makeSvg("svg", {
      "class": "ns-utility-curve",
      viewBox: "0 0 " + CURVE_WIDTH + " " + CURVE_HEIGHT,
      width: String(CURVE_WIDTH),
      height: String(CURVE_HEIGHT),
      "aria-hidden": "true",
      focusable: "false"
    });
    svg.appendChild(makeSvg("rect", { "class": "ns-utility-curve-back", x: "0", y: "0", width: String(CURVE_WIDTH), height: String(CURVE_HEIGHT), rx: "4" }));

    // Linear keys: the plot needs only the two ends and the keys between them
    var times = [0];
    keys.forEach(function (key) {
      if (key.time > 0 && key.time < 1) {
        times.push(key.time);
      }
    });
    times.push(1);
    var points = times.map(function (time) {
      return curveX(time).toFixed(1) + "," + curveY(evalCurve(keys, time)).toFixed(1);
    }).join(" ");
    svg.appendChild(makeSvg("polyline", { "class": "ns-utility-curve-line", points: points }));

    var dot = makeSvg("circle", { "class": "ns-utility-curve-dot", cx: "0", cy: "0", r: "3" });
    svg.appendChild(dot);
    return { node: svg, dot: dot };
  }

  window.NsShowcase.register(".ns-utility", function (root) {
    var inputList = root.querySelector(".ns-utility-inputs");
    var actionList = root.querySelector(".ns-utility-actions");
    if (!inputList || !actionList) {
      throw new Error("missing inputs or actions");
    }

    var inputs = {};
    var actions = [];
    var result = make("p", "ns-utility-result");
    result.setAttribute("aria-live", "polite");
    root.insertBefore(result, actionList);

    // Each input becomes a slider from 0 to 1
    Array.prototype.forEach.call(inputList.querySelectorAll("li[data-input]"), function (item) {
      var name = item.getAttribute("data-input");
      var hint = item.getAttribute("data-hint");
      var value = clamp(Number(item.getAttribute("data-value")) || 0, 0, 1);
      inputs[name] = value;

      var label = make("label", "ns-utility-input");
      label.appendChild(make("span", "ns-utility-input-name", name));
      var range = document.createElement("input");
      range.type = "range";
      range.min = "0";
      range.max = "1";
      range.step = "0.01";
      range.value = String(value);
      range.setAttribute("aria-label", hint ? name + ", " + hint : name);
      label.appendChild(range);
      var output = make("output", "ns-utility-input-value", value.toFixed(2));
      label.appendChild(output);

      item.textContent = "";
      item.appendChild(label);
      if (hint) {
        item.appendChild(make("span", "ns-utility-hint", hint));
      }

      range.addEventListener("input", function () {
        inputs[name] = Number(range.value);
        output.textContent = inputs[name].toFixed(2);
        update();
      });
    });

    // Each action becomes a card: the name, the score bar, one row for each consideration, and the formula
    Array.prototype.slice.call(actionList.children).forEach(function (item) {
      if (!item.hasAttribute("data-action")) {
        return;
      }
      var action = {
        name: item.getAttribute("data-action"),
        item: item,
        considerations: Array.prototype.map.call(item.querySelectorAll("li[data-input]"), function (term) {
          return {
            input: term.getAttribute("data-input"),
            keys: term.hasAttribute("data-curve") ? parseKeys(term.getAttribute("data-curve")) : DEFAULT_KEYS
          };
        })
      };

      item.textContent = "";
      var head = make("div", "ns-utility-head");
      head.appendChild(make("b", "ns-utility-name", action.name));
      head.appendChild(make("span", "ns-utility-badge", "Best Action"));
      action.scoreText = make("span", "ns-utility-score");
      head.appendChild(action.scoreText);
      item.appendChild(head);

      var bar = make("div", "ns-utility-bar");
      bar.setAttribute("aria-hidden", "true");
      action.fill = make("span");
      bar.appendChild(action.fill);
      item.appendChild(bar);

      var terms = make("ul", "ns-utility-terms");
      action.rows = action.considerations.map(function (consideration) {
        var row = make("li");
        var plot = makeCurvePlot(consideration.keys);
        row.appendChild(plot.node);
        var text = make("span", "ns-utility-term");
        text.appendChild(make("b", null, consideration.input));
        var math = make("span", "ns-utility-math");
        text.appendChild(math);
        row.appendChild(text);
        terms.appendChild(row);
        return { dot: plot.dot, math: math };
      });
      item.appendChild(terms);

      action.formula = make("p", "ns-utility-formula");
      item.appendChild(action.formula);
      actions.push(action);
    });

    if (actions.length === 0) {
      throw new Error("no actions");
    }

    function update() {
      var results = actions.map(function (action) {
        return scoreAction(action, inputs);
      });
      var best = chooseAction(results);

      actions.forEach(function (action, index) {
        var scored = results[index];
        action.scoreText.textContent = scored.score.toFixed(2);
        action.fill.style.width = (clamp(scored.score, 0, 1) * 100).toFixed(1) + "%";
        action.item.setAttribute("aria-current", index === best ? "true" : "false");

        action.rows.forEach(function (row, termIndex) {
          var term = scored.terms[termIndex];
          row.dot.setAttribute("cx", curveX(term.x).toFixed(1));
          row.dot.setAttribute("cy", curveY(term.curve).toFixed(1));
          row.math.textContent = "input " + term.x.toFixed(2) + " → curve " + term.curve.toFixed(2) + " → final " + term.finalScore.toFixed(2);
        });

        if (scored.terms.length === 0) {
          action.formula.textContent = "No considerations: the score is 1.";
        } else {
          action.formula.textContent = "ModificationFactor 1 − 1/" + scored.terms.length + " = " + scored.factor.toFixed(2) +
            ". Score " + scored.terms.map(function (term) {
              return term.finalScore.toFixed(2);
            }).join(" × ") + " = " + scored.score.toFixed(2);
        }
      });

      var text = best >= 0 ? "Best Action: " + actions[best].name : "Best Action: none. All scores are 0.";
      if (result.textContent !== text) {
        result.textContent = text;
      }
    }

    // Two columns when the widget is wide, one column when it is narrow
    function resize() {
      root.classList.toggle("ns-utility-wide", root.clientWidth >= 640);
    }

    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(root);
    } else {
      window.addEventListener("resize", resize);
    }
    resize();
    update();
  });
})();
