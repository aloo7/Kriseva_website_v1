/* A narrow physical screen can receive a wider layout viewport in some
   browser modes. Adapt the homepage without changing viewport or zoom. */
(() => {
  const root = document.documentElement;
  let frame = 0;

  const update = () => {
    frame = 0;
    const screenWidth = window.screen.width;
    const shortSide = Math.min(screenWidth, window.screen.height);
    const touch = navigator.maxTouchPoints > 0 || matchMedia('(any-pointer: coarse)').matches;
    // clientWidth avoids a feedback loop when enlarged content temporarily
    // overflows during a WebKit viewport resize.
    const layoutWidth = Math.min(window.innerWidth, root.clientWidth || window.innerWidth);
    const ratio = screenWidth > 0 ? layoutWidth / screenWidth : 1;
    const needsComfort = touch && shortSide > 0 && shortSide <= 600 && ratio > 1.25;

    if (needsComfort) {
      root.setAttribute('data-phone-layout', '');
      root.style.setProperty('--phone-layout-scale', String(Math.min(ratio, 3.2)));
      root.style.setProperty('--phone-layout-ratio', String(ratio));
    } else {
      root.removeAttribute('data-phone-layout');
      root.style.removeProperty('--phone-layout-scale');
      root.style.removeProperty('--phone-layout-ratio');
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
    // WebKit can dispatch resize before its layout viewport has settled.
    // One delayed read handles that ordering without a polling loop.
    clearTimeout(settled);
    settled = setTimeout(update, 120);
  };
  let settled = 0;

  update();
  addEventListener('DOMContentLoaded', update, { once: true });
  addEventListener('load', update, { once: true });
  addEventListener('resize', schedule, { passive: true });
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });
  addEventListener('orientationchange', schedule, { passive: true });
  window.screen.orientation?.addEventListener('change', schedule);
})();
