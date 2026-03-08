(function () {
  if (window.__mykaaMediaZoomInitialized) {
    return;
  }
  window.__mykaaMediaZoomInitialized = true;

  var mainBody = document.getElementById("main-body");
  if (!mainBody) {
    return;
  }

  function isZoomableImage(img) {
    if (!img || img.tagName !== "IMG") {
      return false;
    }

    if (img.classList.contains("no-zoom") || img.dataset.noZoom === "true") {
      return false;
    }

    if (img.closest("#main-header, #main-footer, .contact-links, .article-quick-nav, #main-header-icons, #main-header-name")) {
      return false;
    }

    return true;
  }

  var overlay = document.createElement("div");
  overlay.id = "media-zoom-overlay";
  overlay.setAttribute("aria-hidden", "true");

  var frame = document.createElement("div");
  frame.id = "media-zoom-frame";

  var image = document.createElement("img");
  image.id = "media-zoom-image";
  image.alt = "";

  var closeButton = document.createElement("button");
  closeButton.id = "media-zoom-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close image zoom");
  closeButton.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.22 3.22a.75.75 0 0 1 1.06 0L8 6.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L9.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L8 9.06l-3.72 3.72a.75.75 0 1 1-1.06-1.06L6.94 8 3.22 4.28a.75.75 0 0 1 0-1.06Z"/></svg>';

  frame.appendChild(image);
  frame.appendChild(closeButton);
  overlay.appendChild(frame);
  document.body.appendChild(overlay);
  document.body.classList.add("media-zoom-enabled");

  function fitImage() {
    if (!overlay.classList.contains("open")) {
      return;
    }

    var naturalW = image.naturalWidth;
    var naturalH = image.naturalHeight;
    if (!naturalW || !naturalH) {
      return;
    }

    var maxW = window.innerWidth * 0.84;
    var maxH = window.innerHeight * 0.82;
    var minTargetH = window.innerHeight * 0.5;

    var scale = Math.min(maxW / naturalW, maxH / naturalH);
    var width = naturalW * scale;
    var height = naturalH * scale;

    if (height < minTargetH) {
      var upScale = minTargetH / height;
      width = width * upScale;
      height = height * upScale;

      if (width > maxW) {
        var capScale = maxW / width;
        width = width * capScale;
        height = height * capScale;
      }
    }

    image.style.width = Math.round(width) + "px";
    image.style.height = Math.round(height) + "px";
  }

  function openZoom(img) {
    var src = img.currentSrc || img.src;
    if (!src) {
      return;
    }

    image.style.width = "";
    image.style.height = "";
    image.src = src;
    image.alt = img.alt || "";

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("media-zoom-open");

    if (image.complete) {
      fitImage();
    }
  }

  function closeZoom() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("media-zoom-open");
    image.src = "";
    image.alt = "";
    image.style.width = "";
    image.style.height = "";
  }

  mainBody.addEventListener("click", function (event) {
    var target = event.target;
    if (!isZoomableImage(target)) {
      return;
    }

    var parentLink = target.closest("a");
    if (parentLink) {
      event.preventDefault();
    }

    openZoom(target);
  });

  image.addEventListener("load", fitImage);
  closeButton.addEventListener("click", closeZoom);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeZoom();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay.classList.contains("open")) {
      closeZoom();
    }
  });

  window.addEventListener("resize", fitImage);
})();
