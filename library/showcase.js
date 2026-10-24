// Small showcases from plugin docs. The plugin sync puts the HTML of a fragment into the page, and this file makes it interactive.
(function () {
  if (window.__mykaaShowcaseInitialized) {
    return;
  }
  window.__mykaaShowcaseInitialized = true;

  // Step slider: <figure class="ns-steps"><ol><li data-image="step1.jpg"><b>Name</b> Text</li>...</ol></figure>
  function initSteps(figure) {
    var list = figure.querySelector("ol");
    var items = list ? Array.prototype.slice.call(list.querySelectorAll("li[data-image]")) : [];
    if (items.length === 0) {
      return;
    }

    var view = document.createElement("div");
    view.className = "ns-steps-view";
    var image = document.createElement("img");
    var range = document.createElement("input");
    range.type = "range";
    range.min = "1";
    range.max = String(items.length);
    range.step = "1";
    range.setAttribute("aria-label", "Step");
    view.appendChild(image);
    view.appendChild(range);
    figure.insertBefore(view, list);

    items.forEach(function (item) {
      var content = document.createElement("span");
      while (item.firstChild) {
        content.appendChild(item.firstChild);
      }
      item.appendChild(content);
      item.tabIndex = 0;
      new Image().src = item.dataset.image;
    });

    function show(step) {
      var item = items[step - 1];
      range.value = String(step);
      image.src = item.dataset.image;
      var name = item.querySelector("b");
      image.alt = "Step " + step + (name ? ", " + name.textContent : "");
      items.forEach(function (other) {
        other.setAttribute("aria-current", other === item ? "true" : "false");
      });
    }

    range.addEventListener("input", function () {
      show(Number(range.value));
    });
    items.forEach(function (item, index) {
      item.addEventListener("click", function () {
        show(index + 1);
      });
      item.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          show(index + 1);
        }
      });
    });

    var start = Number(figure.dataset.start) || items.length;
    show(Math.min(Math.max(start, 1), items.length));
    figure.classList.add("is-live");
  }

  document.querySelectorAll(".ns-showcase .ns-steps").forEach(initSteps);
})();
