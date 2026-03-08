(function () {
  if (window.__mykaaQuickNavInitialized) {
    return;
  }
  window.__mykaaQuickNavInitialized = true;

  function updateQuickNavPosition() {
    var quickNav = document.querySelector('.article-quick-nav');
    var footer = document.getElementById('main-footer');
    if (!quickNav || !footer) {
      return;
    }

    var styles = window.getComputedStyle(quickNav);
    var baseBottom = parseFloat(styles.getPropertyValue('--quick-nav-base-bottom'));
    if (Number.isNaN(baseBottom)) {
      baseBottom = parseFloat(styles.bottom) || 12;
    }

    var footerRect = footer.getBoundingClientRect();
    var overlap = window.innerHeight - footerRect.top;
    var extraLift = overlap > 0 ? overlap + 8 : 0;

    quickNav.style.bottom = Math.round(baseBottom + extraLift) + 'px';
  }

  updateQuickNavPosition();
  window.addEventListener('load', updateQuickNavPosition);
  window.addEventListener('resize', updateQuickNavPosition);
  window.addEventListener('scroll', updateQuickNavPosition, { passive: true });
})();
