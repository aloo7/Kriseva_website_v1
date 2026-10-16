export function initHomeFilm(root: HTMLElement): void {
  const video = root.querySelector<HTMLVideoElement>('[data-film-video]');
  const play = root.querySelector<HTMLButtonElement>('[data-film-play]');
  const label = root.querySelector<HTMLElement>('[data-film-label]');
  const status = root.querySelector<HTMLElement>('[data-film-status]');
  const chapters = [...root.querySelectorAll<HTMLButtonElement>('[data-film-time]')];
  if (!video) return;
  const narrow = matchMedia('(max-width: 700px)');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let pendingTime = 0;
  let resume = false;
  const source = () => {
    const format = narrow.matches || document.documentElement.hasAttribute('data-phone-layout') ? 'portrait' : 'wide';
    if (video.dataset.format === format) return;
    const loaded = video.readyState > 0;
    if (!pendingTime && loaded) pendingTime = video.currentTime;
    resume = resume || (loaded && !video.paused);
    video.dataset.format = format;
    video.poster = `/media/kriseva-${format}-poster.jpg`;
    video.src = `/media/kriseva-${format}.mp4`;
    if (loaded) { video.preload = 'auto'; video.load(); }
  };
  const sync = () => {
    root.toggleAttribute('data-playing', !video.paused && !video.ended);
    if (label) label.textContent = resume && (pendingTime > 0 || video.seeking) ? 'Cancel loading' : video.ended ? 'Replay film' : video.paused ? 'Play film' : 'Pause film';
    const time = pendingTime || video.currentTime;
    let active = 0;
    chapters.forEach((button, i) => { if (time >= Number(button.dataset.filmTime)) active = i; });
    chapters.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
  };
  const playNow = () => {
    if (status) status.textContent = '';
    void video.play().catch(() => {
      if (status) status.textContent = 'The film could not play. You can read the story below or use the video controls to try again.';
      sync();
    });
  };
  const resumeAfterSeek = () => {
    if (resume && !pendingTime && !video.seeking) { resume = false; playNow(); }
    sync();
  };
  const applyPendingSeek = () => {
    if (!pendingTime || video.readyState < 2 || video.seeking) return;
    const time = Math.min(pendingTime, Math.max(0, video.duration - .05));
    // A full-file 200 response can expose metadata before the requested
    // position is seekable. Wait for actual media readiness instead of
    // discarding the chapter request at loadedmetadata.
    let available = false;
    for (let i = 0; i < video.seekable.length; i++) {
      if (video.seekable.start(i) <= time && video.seekable.end(i) >= time) available = true;
    }
    if (!available) return;
    pendingTime = 0;
    video.currentTime = time;
    resumeAfterSeek();
  };
  const start = () => {
    if (pendingTime > 0) {
      resume = true;
      video.pause();
      video.preload = 'auto';
      if (video.networkState === 0 || video.networkState === 3) video.load();
      if (status) status.textContent = 'Loading the selected chapter.';
      applyPendingSeek(); sync();
    } else playNow();
  };
  const stop = () => { resume = false; video.pause(); if (status) status.textContent = ''; sync(); };
  video.addEventListener('loadedmetadata', () => {
    if (pendingTime) applyPendingSeek();
    else resumeAfterSeek();
  });
  ['loadeddata', 'canplay', 'canplaythrough', 'progress'].forEach((name) => video.addEventListener(name, applyPendingSeek));
  video.addEventListener('seeked', resumeAfterSeek);
  video.addEventListener('error', () => {
    resume = false; pendingTime = 0;
    if (status) status.textContent = 'The film could not play. You can read the story below or use the video controls to try again.';
    sync();
  });
  ['play', 'pause', 'ended', 'timeupdate'].forEach((name) => video.addEventListener(name, sync));
  play?.addEventListener('click', () => {
    if (resume && (pendingTime > 0 || video.seeking)) { stop(); return; }
    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0;
      video.scrollIntoView({ block: 'center', behavior: preference.matches ? 'auto' : 'smooth' });
      start();
    }
    else stop();
  });
  chapters.forEach((button) => button.addEventListener('click', () => {
    const time = Number(button.dataset.filmTime);
    pendingTime = time;
    if (!time && video.readyState) video.currentTime = 0;
    start();
  }));
  narrow.addEventListener('change', source);
  const phone = new MutationObserver(source);
  phone.observe(document.documentElement, { attributes: true, attributeFilter: ['data-phone-layout'] });
  preference.addEventListener('change', () => { if (preference.matches) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) stop(); });
  observer.observe(video);
  source(); sync();
  root.querySelectorAll<HTMLElement>('[data-film-controls]').forEach((control) => { control.hidden = false; });
  root.setAttribute('data-film-ready', '');
}
