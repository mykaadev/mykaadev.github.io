// Small showcases from plugin docs. The plugin sync puts the HTML of a fragment into the page, and this file makes it interactive.
// Each plugin can add its own widget in library/showcases/<repo in lower case>.js. That file calls NsShowcase.register.
(function () {
  if (window.NsShowcase) {
    return;
  }

  var widgets = [];
  var started = false;

  function run(selector, init) {
    document.querySelectorAll(".ns-showcase " + selector).forEach(function (root) {
      if (root.dataset.nsShowcaseLive) {
        return;
      }
      root.dataset.nsShowcaseLive = "1";
      try {
        init(root);
        root.classList.add("is-live");
      } catch (error) {
        // A broken widget leaves its plain HTML in place
        if (window.console) {
          console.error("Showcase " + selector + " failed", error);
        }
      }
    });
  }

  window.NsShowcase = {
    // selector: the class of the root element of the fragment, for example ".ns-ease"
    // init(root): builds the widget inside root. The plain HTML stays readable without it.
    register: function (selector, init) {
      widgets.push([selector, init]);
      if (started) {
        run(selector, init);
      }
    }
  };

  function start() {
    started = true;
    widgets.forEach(function (widget) {
      run(widget[0], widget[1]);
    });
  }

  // Step slider: <figure class="ns-steps"><ol><li data-image="step1.jpg"><b>Name</b> Text</li>...</ol></figure>
  window.NsShowcase.register(".ns-steps", function (figure) {
    var list = figure.querySelector("ol");
    var items = list ? Array.prototype.slice.call(list.querySelectorAll("li[data-image]")) : [];
    if (items.length === 0) {
      throw new Error("no steps");
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
  });

  // Deferred widget files run before DOMContentLoaded, so all of them are registered by then
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
