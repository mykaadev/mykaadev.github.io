// NsBackpack showcase: a grid backpack with shaped items.
// The fit, move, rotate, join, and add rules are ports of the NsBackpackGrid module of the plugin.
(function () {
  if (!window.NsShowcase) {
    return;
  }

  var COLORS = ["#c2335a", "#2f7fc1", "#b8862a", "#8a5cc4", "#2a8f9e", "#c25f2c", "#6b7a8f", "#9ea13f"];
  var FIT = "rgba(95, 211, 141, 0.55)";
  var NO_FIT = "rgba(240, 58, 58, 0.55)";

  // Reads "2x3" as a box of 2 columns and 3 rows. Each side is at least 1
  function parseSize(text) {
    var parts = String(text || "1x1").split("x");
    return [Math.max(1, parseInt(parts[0], 10) || 1), Math.max(1, parseInt(parts[1], 10) || 1)];
  }

  // Reads "0,0 0,1 1,1" as a list of cells
  function parseCells(text) {
    var cells = [];
    String(text || "").trim().split(/\s+/).forEach(function (pair) {
      var xy = pair.split(",");
      if (xy.length === 2 && xy[0] !== "" && xy[1] !== "") {
        cells.push([parseInt(xy[0], 10), parseInt(xy[1], 10)]);
      }
    });
    return cells;
  }

  // Source/NsBackpackGrid/Public/NsBackpackGridShape.h:27
  function normalizeRotation(rotation) {
    return ((rotation % 4) + 4) % 4;
  }

  // Source/NsBackpackGrid/Private/NsBackpackGridShape.cpp:7
  function shapeCells(item, rotation) {
    var width = item.w;
    var height = item.h;
    var result = [];
    // Cells outside the box and second copies of a cell do not count
    item.cells.forEach(function (cell) {
      var inBox = cell[0] >= 0 && cell[1] >= 0 && cell[0] < width && cell[1] < height;
      var copy = result.some(function (other) { return other[0] === cell[0] && other[1] === cell[1]; });
      if (inBox && !copy) {
        result.push([cell[0], cell[1]]);
      }
    });
    if (result.length === 0) {
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          result.push([x, y]);
        }
      }
    }
    // A clockwise quarter turn moves the cell (X, Y) of a box of height H to (H - 1 - Y, X)
    for (var turn = 0; turn < normalizeRotation(rotation); turn++) {
      for (var i = 0; i < result.length; i++) {
        result[i] = [height - 1 - result[i][1], result[i][0]];
      }
      var swap = width;
      width = height;
      height = swap;
    }
    return result;
  }

  window.NsShowcase.register(".ns-backpack", function (root) {
    var list = root.querySelector("ul");
    var entries = list ? Array.prototype.slice.call(list.querySelectorAll("li")) : [];
    if (entries.length === 0) {
      throw new Error("no items");
    }
    var width = Math.max(1, parseInt(root.dataset.width, 10) || 4);
    var height = Math.max(1, parseInt(root.dataset.height, 10) || 4);
    var count = width * height;

    // One item definition for each name. The first entry of a name gives its shape and Max Stack
    var items = [];
    var starts = entries.map(function (entry) {
      var nameNode = entry.querySelector("b");
      var name = (nameNode ? nameNode.textContent : entry.textContent).trim();
      var item = items.filter(function (other) { return other.name === name; })[0];
      if (!item) {
        var size = parseSize(entry.dataset.size);
        item = {
          name: name,
          w: size[0],
          h: size[1],
          cells: parseCells(entry.dataset.cells),
          maxStack: Math.max(1, parseInt(entry.dataset.maxStack, 10) || 1),
          color: COLORS[items.length % COLORS.length]
        };
        items.push(item);
      }
      return {
        item: item,
        quantity: Math.max(1, parseInt(entry.dataset.quantity, 10) || 1),
        slot: parseInt(entry.dataset.slot, 10),
        rotation: parseInt(entry.dataset.rotation, 10) || 0
      };
    });

    // Backpack state: one stack or null for each slot, and the quarter turns of each slot
    var slots = [];
    var rotations = [];
    var owners = [];

    // Interaction state
    var cursor = [0, 0];
    var selected = -1;
    var held = null; // { from, rotation, offset: [x, y], pointer }
    var message = "";
    var cellSize = 48;
    var frame = 0;

    // Source/NsBackpackGrid/Private/NsBackpackGridComponent.cpp:209
    function cellIndex(x, y) {
      if (x < 0 || y < 0 || x >= width || y >= height) {
        return -1;
      }
      return y * width + x;
    }

    // Source/NsBackpackGrid/Private/NsBackpackGridComponent.cpp:218
    function cellPosition(slot) {
      return [slot % width, Math.floor(slot / width)];
    }

    // Source/NsBackpackGrid/Private/NsBackpackGridComponent.cpp:173
    function itemCells(slot) {
      var result = [];
      if (!slots[slot]) {
        return result;
      }
      var anchor = cellPosition(slot);
      shapeCells(slots[slot].item, rotations[slot]).forEach(function (offset) {
        var cell = cellIndex(anchor[0] + offset[0], anchor[1] + offset[1]);
        if (cell !== -1) {
          result.push(cell);
        }
      });
      return result;
    }

    // Source/NsBackpackGrid/Private/NsBackpackGridComponent.cpp:272
    function buildOwners() {
      owners = [];
      for (var cell = 0; cell < count; cell++) {
        owners.push(-1);
      }
      for (var slot = 0; slot < count; slot++) {
        itemCells(slot).forEach(function (index) {
          if (owners[index] === -1) {
            owners[index] = slot;
          }
        });
      }
    }

    // Source/NsBackpackGrid/Private/NsBackpackGridComponent.cpp:250
    // An empty slot keeps rotation 0. The cell map is built again after each change
    function notifyChanged() {
      for (var slot = 0; slot < count; slot++) {
        if (!slots[slot]) {
          rotations[slot] = 0;
        }
      }
      buildOwners();
    }

    // Source/NsBackpackGrid/Private/NsBackpackGridComponent.cpp:223 (Can Accept, with the rotation and the ignored slot of Can Place)
    // Returns an empty string for a fit, or the reason for no fit
    function fitProblem(item, x, y, rotation, ignoreSlot) {
      var slot = cellIndex(x, y);
      if (slot === -1) {
        return "The top left cell is outside the grid.";
      }
      var cells = shapeCells(item, rotation);
      for (var i = 0; i < cells.length; i++) {
        var cell = cellIndex(x + cells[i][0], y + cells[i][1]);
        if (cell === -1) {
          return "A cell is outside the grid.";
        }
        var owner = owners[cell];
        // The item in the slot itself does not block, because the new item replaces it
        if (owner !== -1 && owner !== slot && owner !== ignoreSlot) {
          return "It covers the " + slots[owner].item.name + ".";
        }
      }
      return "";
    }

    // Source/NsBackpack/Private/NsBackpackComponent.cpp:231
    function getRoom(slot, item) {
      var stack = slots[slot];
      if (!stack || stack.item !== item) {
        return 0;
      }
      return Math.max(0, item.maxStack - stack.quantity);
    }

    // Source/NsBackpackGrid/Private/NsBackpackGridComponent.cpp:289 (the demo has no item data)
    function canJoin(from, to) {
      return !!slots[from] && !!slots[to] && slots[to].item === slots[from].item && slots[to].quantity < slots[from].item.maxStack;
    }

    // Plans a drop of the item of slot From with its top left cell on (x, y). Nothing changes yet
    // Source/NsBackpackGrid/Private/NsBackpackGridComponent.cpp:40 (Move Slot) and :94 (Move Item)
    function planDrop(from, x, y, rotation) {
      var moved = slots[from];
      var to = cellIndex(x, y);
      if (to === -1) {
        return { ok: false, text: "The top left cell is outside the grid." };
      }
      // A drop on a covered cell can only join the stack that covers it
      var owner = owners[to];
      if (owner !== -1 && owner !== from) {
        if (!canJoin(from, owner)) {
          var other = slots[owner].item;
          return { ok: false, text: other === moved.item ? "The " + other.name + " stack is full." : "It covers the " + other.name + "." };
        }
        var amount = Math.min(getRoom(owner, moved.item), moved.quantity);
        return { ok: true, join: true, to: owner, amount: amount, text: "It joins the stack in slot " + owner + ": " + amount + " move." };
      }
      // Move Item: the target slot must be empty, except for a turn on the same slot
      if (to !== from && slots[to]) {
        return { ok: false, text: "Slot " + to + " holds the " + slots[to].item.name + ". Its top left cell is open." };
      }
      var problem = fitProblem(moved.item, x, y, rotation, from);
      if (problem) {
        return { ok: false, text: problem };
      }
      return { ok: true, join: false, to: to, text: "It fits in slot " + to + " with rotation " + normalizeRotation(rotation) + "." };
    }

    // Applies a plan from planDrop
    function applyDrop(from, plan, rotation) {
      if (plan.join) {
        // Source/NsBackpack/Private/NsBackpackComponent.cpp:141
        slots[plan.to].quantity += plan.amount;
        slots[from].quantity -= plan.amount;
        if (slots[from].quantity <= 0) {
          slots[from] = null;
        }
      } else if (plan.to === from) {
        rotations[from] = normalizeRotation(rotation);
      } else {
        slots[plan.to] = slots[from];
        rotations[plan.to] = normalizeRotation(rotation);
        slots[from] = null;
      }
      notifyChanged();
    }

    // Source/NsBackpackGrid/Private/NsBackpackGridComponent.cpp:118 (Rotate Item: Move Item on the same slot)
    function rotateItem(slot) {
      var position = cellPosition(slot);
      var plan = planDrop(slot, position[0], position[1], rotations[slot] + 1);
      if (plan.ok) {
        applyDrop(slot, plan, rotations[slot] + 1);
        return "Rotate Item: the " + slots[slot].item.name + " turns to rotation " + rotations[slot] + ".";
      }
      return "Rotate Item fails. " + plan.text;
    }

    // Source/NsBackpackGrid/Private/NsBackpackGridComponent.cpp:148
    function findPlacement(item) {
      for (var rotation = 0; rotation < 4; rotation++) {
        for (var slot = 0; slot < count; slot++) {
          var position = cellPosition(slot);
          if (!slots[slot] && !fitProblem(item, position[0], position[1], rotation, -1)) {
            return { slot: slot, rotation: rotation };
          }
        }
      }
      return null;
    }

    // Source/NsBackpack/Private/NsBackpackComponent.cpp:49 and Source/NsBackpackGrid/Private/NsBackpackGridComponent.cpp:22
    // Returns the quantity that does not fit
    function addItem(item, quantity) {
      var remaining = quantity;
      // The stacks of the item fill first
      for (var slot = 0; slot < count && remaining > 0; slot++) {
        if (slots[slot]) {
          var added = Math.min(getRoom(slot, item), remaining);
          slots[slot].quantity += added;
          remaining -= added;
        }
      }
      // Then the empty slots where the item fits with no rotation
      for (slot = 0; slot < count && remaining > 0; slot++) {
        var position = cellPosition(slot);
        if (!slots[slot] && !fitProblem(item, position[0], position[1], 0, -1)) {
          var stack = Math.min(item.maxStack, remaining);
          slots[slot] = { item: item, quantity: stack };
          rotations[slot] = 0;
          remaining -= stack;
          buildOwners();
        }
      }
      // Then the first fit with a rotation
      while (remaining > 0) {
        var place = findPlacement(item);
        if (!place) {
          break;
        }
        var size = Math.min(item.maxStack, remaining);
        slots[place.slot] = { item: item, quantity: size };
        rotations[place.slot] = place.rotation;
        remaining -= size;
        buildOwners();
      }
      notifyChanged();
      return remaining;
    }

    // Puts the start stacks of the fragment in the grid, with the checks of Place Item (cpp:81)
    function reset() {
      slots = [];
      rotations = [];
      for (var slot = 0; slot < count; slot++) {
        slots.push(null);
        rotations.push(0);
      }
      buildOwners();
      starts.forEach(function (start) {
        var position = cellPosition(start.slot);
        var valid = start.slot >= 0 && start.slot < count && !slots[start.slot] && start.quantity <= start.item.maxStack;
        if (valid && !fitProblem(start.item, position[0], position[1], start.rotation, -1)) {
          slots[start.slot] = { item: start.item, quantity: start.quantity };
          rotations[start.slot] = normalizeRotation(start.rotation);
          buildOwners();
        }
      });
      notifyChanged();
      held = null;
      selected = -1;
      message = "";
    }

    // ---- View ----

    var view = document.createElement("div");
    view.className = "ns-backpack-view";
    var canvas = document.createElement("canvas");
    canvas.className = "ns-backpack-grid";
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label", "Backpack grid. Arrow keys move the cursor. Enter picks up or drops an item. R turns it. Escape cancels.");
    var status = document.createElement("p");
    status.className = "ns-backpack-status";
    status.setAttribute("aria-live", "polite");
    var tools = document.createElement("div");
    tools.className = "ns-backpack-tools";

    function makeButton(text, label, action) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = text;
      button.setAttribute("aria-label", label);
      button.addEventListener("click", action);
      tools.appendChild(button);
      return button;
    }

    makeButton("Rotate (R)", "Rotate the item", function () {
      rotate();
    });
    items.forEach(function (item) {
      var button = makeButton("+ " + item.name, "Add one " + item.name, function () {
        var left = addItem(item, 1);
        message = left > 0 ? "Add Item: no room for the " + item.name + "." : "Add Item: one " + item.name + " goes in.";
        held = null;
        draw();
      });
      button.style.borderColor = item.color;
    });
    makeButton("Reset", "Reset the backpack", function () {
      reset();
      draw();
    });

    view.appendChild(canvas);
    view.appendChild(status);
    view.appendChild(tools);
    root.insertBefore(view, list);

    function heldCells() {
      return shapeCells(slots[held.from].item, held.rotation);
    }

    function heldAnchor() {
      return [cursor[0] - held.offset[0], cursor[1] - held.offset[1]];
    }

    function heldPlan() {
      var anchor = heldAnchor();
      return planDrop(held.from, anchor[0], anchor[1], held.rotation);
    }

    function describeStack(slot) {
      var stack = slots[slot];
      var text = stack.item.name + " in slot " + slot + ", rotation " + rotations[slot];
      return stack.item.maxStack > 1 ? text + ", " + stack.quantity + " of " + stack.item.maxStack + "." : text + ".";
    }

    function updateStatus() {
      var filled = owners.filter(function (owner) { return owner !== -1; }).length;
      var text;
      if (held) {
        text = (heldPlan().ok ? "Fit. " : "No fit. ") + heldPlan().text;
      } else if (message) {
        text = message;
      } else if (selected !== -1 && slots[selected]) {
        text = describeStack(selected);
      } else {
        text = "Filled cells: " + filled + " of " + count + ". Pick an item.";
      }
      status.textContent = text;
    }

    function fillCell(context, x, y, inset) {
      context.fillRect(x * cellSize + inset, y * cellSize + inset, cellSize - inset * 2, cellSize - inset * 2);
    }

    function render() {
      frame = 0;
      var context = canvas.getContext("2d");
      var ratio = window.devicePixelRatio || 1;
      var cssWidth = width * cellSize;
      var cssHeight = height * cellSize;
      if (canvas.width !== Math.round(cssWidth * ratio) || canvas.height !== Math.round(cssHeight * ratio)) {
        canvas.width = Math.round(cssWidth * ratio);
        canvas.height = Math.round(cssHeight * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, cssWidth, cssHeight);

      // Empty cells
      context.fillStyle = "#16171b";
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          fillCell(context, x, y, 1);
        }
      }

      // Items. Neighbor cells of one item join, so a shape reads as one piece
      var gap = 3;
      for (var cell = 0; cell < count; cell++) {
        var owner = owners[cell];
        if (owner === -1) {
          continue;
        }
        var cx = cell % width;
        var cy = Math.floor(cell / width);
        var right = cx + 1 < width && owners[cell + 1] === owner;
        var down = cy + 1 < height && owners[cell + width] === owner;
        var corner = right && down && owners[cell + width + 1] === owner;
        var left = cx * cellSize;
        var top = cy * cellSize;
        var inner = cellSize - gap * 2;
        // The joins overlap the cells by 1 pixel, so no seam shows between them
        context.fillStyle = slots[owner].item.color;
        context.fillRect(left + gap, top + gap, inner, inner);
        if (right) {
          context.fillRect(left + cellSize - gap - 1, top + gap, gap * 2 + 2, inner);
        }
        if (down) {
          context.fillRect(left + gap, top + cellSize - gap - 1, inner, gap * 2 + 2);
        }
        if (corner) {
          context.fillRect(left + cellSize - gap - 1, top + cellSize - gap - 1, gap * 2 + 2, gap * 2 + 2);
        }
        // The held item stays dim at its old place
        if (held && held.from === owner) {
          context.fillStyle = "rgba(16, 17, 20, 0.7)";
          context.fillRect(left, top, cellSize, cellSize);
        }
      }

      // Labels: the name on the first cell, and the quantity on the last cell
      context.textBaseline = "middle";
      for (var slot = 0; slot < count; slot++) {
        var cells = itemCells(slot);
        if (cells.length === 0) {
          continue;
        }
        var item = slots[slot].item;
        var first = cells.reduce(function (a, b) { return Math.min(a, b); });
        var last = cells.reduce(function (a, b) { return Math.max(a, b); });
        context.fillStyle = "#ffffff";
        context.font = Math.max(9, Math.round(cellSize * 0.22)) + "px \"Overpass Mono\", monospace";
        context.textAlign = "left";
        var name = item.name;
        if (context.measureText(name).width > cellSize - 8) {
          name = name.slice(0, 3);
        }
        context.fillText(name, (first % width) * cellSize + 5, Math.floor(first / width) * cellSize + cellSize * 0.3);
        if (item.maxStack > 1) {
          context.textAlign = "right";
          context.fillText("x" + slots[slot].quantity, (last % width) * cellSize + cellSize - 5, Math.floor(last / width) * cellSize + cellSize * 0.75);
        }
      }

      // Selected item
      if (selected !== -1 && slots[selected] && !held) {
        context.strokeStyle = "#ffffff";
        context.lineWidth = 2;
        itemCells(selected).forEach(function (index) {
          context.strokeRect((index % width) * cellSize + 2, Math.floor(index / width) * cellSize + 2, cellSize - 4, cellSize - 4);
        });
      }

      // Preview of the held item: green for a fit, red for no fit
      if (held) {
        var plan = heldPlan();
        context.fillStyle = plan.ok ? FIT : NO_FIT;
        if (plan.join) {
          itemCells(plan.to).forEach(function (index) {
            fillCell(context, index % width, Math.floor(index / width), 2);
          });
        } else {
          var anchor = heldAnchor();
          heldCells().forEach(function (offset) {
            var px = anchor[0] + offset[0];
            var py = anchor[1] + offset[1];
            if (cellIndex(px, py) !== -1) {
              fillCell(context, px, py, 2);
            }
          });
        }
      }

      // Keyboard cursor
      if (document.activeElement === canvas) {
        context.strokeStyle = "#f03a6c";
        context.lineWidth = 2;
        context.strokeRect(cursor[0] * cellSize + 1, cursor[1] * cellSize + 1, cellSize - 2, cellSize - 2);
      }
    }

    // Writes the status now and paints on the next frame. Nothing animates, so no loop runs
    function draw() {
      updateStatus();
      if (!frame) {
        frame = window.requestAnimationFrame(render);
      }
    }

    function resize() {
      var size = Math.floor(view.clientWidth / width);
      cellSize = Math.max(16, Math.min(64, size));
      // The CSS size changes now, so pointer math is right before the next paint
      canvas.style.width = width * cellSize + "px";
      canvas.style.height = height * cellSize + "px";
      draw();
    }

    // ---- Actions ----

    function pickUp(pointer) {
      var cell = cellIndex(cursor[0], cursor[1]);
      var owner = cell === -1 ? -1 : owners[cell];
      selected = owner;
      message = "";
      if (owner === -1) {
        held = null;
        return;
      }
      var anchor = cellPosition(owner);
      held = { from: owner, rotation: rotations[owner], offset: [cursor[0] - anchor[0], cursor[1] - anchor[1]], pointer: pointer, moved: false };
    }

    function drop() {
      var plan = heldPlan();
      var from = held.from;
      var rotation = held.rotation;
      held = null;
      if (!plan.ok) {
        message = "Move fails. " + plan.text;
        return;
      }
      applyDrop(from, plan, rotation);
      selected = plan.to;
      message = plan.join ? "Move Slot: " + plan.amount + " join the stack in slot " + plan.to + "." : "Move Item: " + describeStack(plan.to);
    }

    function rotate() {
      if (held) {
        // The grabbed cell turns with the shape, so it stays under the cursor
        var item = slots[held.from].item;
        var boxHeight = held.rotation % 2 === 0 ? item.h : item.w;
        held.offset = [boxHeight - 1 - held.offset[1], held.offset[0]];
        held.rotation = normalizeRotation(held.rotation + 1);
        held.moved = true;
      } else if (selected !== -1 && slots[selected]) {
        message = rotateItem(selected);
      } else {
        message = "Pick an item first.";
      }
      draw();
    }

    canvas.addEventListener("keydown", function (event) {
      var moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (moves[event.key]) {
        cursor = [
          Math.max(0, Math.min(width - 1, cursor[0] + moves[event.key][0])),
          Math.max(0, Math.min(height - 1, cursor[1] + moves[event.key][1]))
        ];
        message = "";
      } else if (event.key === "Enter" || event.key === " ") {
        if (held) {
          drop();
        } else {
          pickUp(null);
        }
      } else if (event.key === "r" || event.key === "R") {
        rotate();
      } else if (event.key === "Escape" && held) {
        held = null;
        message = "The move is canceled.";
      } else {
        return;
      }
      event.preventDefault();
      draw();
    });

    function pointerCell(event) {
      var rect = canvas.getBoundingClientRect();
      var size = rect.width / width || cellSize;
      return [Math.floor((event.clientX - rect.left) / size), Math.floor((event.clientY - rect.top) / size)];
    }

    canvas.addEventListener("pointerdown", function (event) {
      if (event.button !== 0 || (held && held.pointer !== null)) {
        return;
      }
      event.preventDefault();
      canvas.focus({ preventScroll: true });
      cursor = pointerCell(event);
      if (held) {
        // An item that the keyboard holds drops on the clicked cell
        drop();
        draw();
        return;
      }
      pickUp(event.pointerId);
      if (held) {
        canvas.setPointerCapture(event.pointerId);
      }
      draw();
    });

    canvas.addEventListener("pointermove", function (event) {
      if (!held || held.pointer !== event.pointerId) {
        return;
      }
      var cell = pointerCell(event);
      if (cell[0] !== cursor[0] || cell[1] !== cursor[1]) {
        cursor = cell;
        held.moved = true;
        draw();
      }
    });

    canvas.addEventListener("pointerup", function (event) {
      if (!held || held.pointer !== event.pointerId) {
        return;
      }
      // A tap with no move only selects the item
      if (held.moved) {
        drop();
      } else {
        held = null;
      }
      cursor = [Math.max(0, Math.min(width - 1, cursor[0])), Math.max(0, Math.min(height - 1, cursor[1]))];
      draw();
    });

    canvas.addEventListener("pointercancel", function () {
      held = null;
      draw();
    });

    canvas.addEventListener("focus", draw);
    canvas.addEventListener("blur", draw);
    root.addEventListener("keydown", function (event) {
      // R also works when a button of the widget has focus
      if ((event.key === "r" || event.key === "R") && event.target !== canvas && event.target.tagName === "BUTTON") {
        event.preventDefault();
        rotate();
      }
    });

    reset();
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(view);
    } else {
      window.addEventListener("resize", resize);
    }
    resize();
  });
})();
