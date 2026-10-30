// Vault cards on the Plugins page: plugins that are not public yet.
// The card tilts toward the pointer, floats a little, and now and then glitches to show a scrambled codename.
(function () {
  if (window.__mykaaVaultCardsInitialized) {
    return;
  }
  window.__mykaaVaultCardsInitialized = true;

  var cards = Array.prototype.slice.call(document.querySelectorAll(".vault-card"));
  if (cards.length === 0) {
    return;
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fake codenames. The glitch corrupts a few letters of one of them.
  var codenames = [
    "NsOracle", "NsHydra", "NsMirage", "NsWeaver", "NsPhantom", "NsAtlas", "NsRift", "NsCinder",
    "NsGrimoire", "NsLattice", "NsSpecter", "NsTitan", "NsVortex", "NsWraith", "NsZenith", "NsKraken"
  ];
  var lines = ["ACCESS DENIED", "NOT YET", "REDACTED", "LOADING...", "SIGNAL LOST", "COOKING", "NO PEEKING"];
  var noise = "#%&@$?!*/\\|<>=+~_";
  var blocks = "█▓▒░";

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function corrupt(text) {
    var chars = text.split("");
    var hits = 1 + Math.floor(Math.random() * 3);
    for (var i = 0; i < hits; i++) {
      var index = Math.floor(Math.random() * chars.length);
      chars[index] = Math.random() < 0.5 ? pick(noise.split("")) : pick(blocks.split(""));
    }
    return chars.join("");
  }

  function randomTitle() {
    return Math.random() < 0.65 ? corrupt(pick(codenames)) : pick(lines);
  }

  function randomNumber(count) {
    var options = ["+??", "+" + (count + 1 + Math.floor(Math.random() * 40)), "+∞", "ERR", "+" + corrupt(String(count)), "0x" + Math.floor(Math.random() * 255).toString(16).toUpperCase()];
    return pick(options);
  }

  function setText(element, text) {
    element.textContent = text;
    element.setAttribute("data-text", text);
  }

  function glitch(card) {
    if (card.classList.contains("is-glitching")) {
      return;
    }

    var title = card.querySelector(".vault-card-title");
    var number = card.querySelector(".vault-card-number");
    var originalTitle = title.textContent;
    var originalNumber = number.textContent;
    var count = Number(card.getAttribute("data-count")) || 1;

    card.classList.add("is-glitching");
    var swaps = 2 + Math.floor(Math.random() * 3);
    var step = 0;
    var timer = window.setInterval(function () {
      step++;
      if (step > swaps) {
        window.clearInterval(timer);
        setText(title, originalTitle);
        setText(number, originalNumber);
        card.classList.remove("is-glitching");
        // While the pointer stays on the card, the glitch keeps going after a short rest
        if (card.__vaultHovered) {
          window.setTimeout(function () {
            if (card.__vaultHovered) {
              glitch(card);
            }
          }, 120 + Math.random() * 380);
        }
        return;
      }
      setText(title, randomTitle());
      setText(number, randomNumber(count));
    }, 110);
  }

  // Each card floats out of step with the others
  cards.forEach(function (card) {
    card.style.setProperty("--float-delay", (-Math.random() * 6).toFixed(2) + "s");
  });

  if (reduceMotion) {
    return;
  }

  // Tilt toward the pointer and move the shine with it
  cards.forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      var rect = card.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width;
      var y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--ry", ((x - 0.5) * 14).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((0.5 - y) * 12).toFixed(2) + "deg");
      card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    });
    card.addEventListener("pointerenter", function () {
      card.__vaultHovered = true;
      glitch(card);
    });
    card.addEventListener("pointerleave", function () {
      card.__vaultHovered = false;
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });

  // A random card glitches every few seconds while the page is visible
  function scheduleGlitch() {
    window.setTimeout(function () {
      if (!document.hidden) {
        glitch(pick(cards));
      }
      scheduleGlitch();
    }, 2500 + Math.random() * 4000);
  }
  scheduleGlitch();
})();
