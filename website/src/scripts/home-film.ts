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
    pendingTime = loaded ? video.currentTime : pendingTime;
    resume = loaded && !video.paused;
    video.dataset.format = format;
    video.poster = `/media/kriseva-${format}-poster.jpg`;
    video.src = `/media/kriseva-${format}.mp4`;
    if (loaded) video.load();
  };
  const sync = () => {
    root.toggleAttribute('data-playing', !video.paused && !video.ended);
    if (label) label.textContent = video.ended ? 'Replay film' : video.paused ? 'Play film' : 'Pause film';
    const time = video.currentTime;
    let active = 0;
    chapters.forEach((button, i) => { if (time >= Number(button.dataset.filmTime)) active = i; });
    chapters.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
  };
  const start = () => {
    if (status) status.textContent = '';
    void video.play().catch(() => {
      if (status) status.textContent = 'The film could not play. You can read the story below or use the video controls to try again.';
      sync();
    });
  };
  video.addEventListener('loadedmetadata', () => {
    if (pendingTime) video.currentTime = Math.min(pendingTime, Math.max(0, video.duration - .05));
    pendingTime = 0;
    if (resume) { resume = false; start(); }
  });
  ['play', 'pause', 'ended', 'timeupdate'].forEach((name) => video.addEventListener(name, sync));
  play?.addEventListener('click', () => {
    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0;
      video.scrollIntoView({ block: 'center', behavior: preference.matches ? 'auto' : 'smooth' });
      start();
    }
    else video.pause();
  });
  chapters.forEach((button) => button.addEventListener('click', () => {
    const time = Number(button.dataset.filmTime);
    if (video.readyState) video.currentTime = time;
    else pendingTime = time;
    start();
  }));
  narrow.addEventListener('change', source);
  const phone = new MutationObserver(source);
  phone.observe(document.documentElement, { attributes: true, attributeFilter: ['data-phone-layout'] });
  preference.addEventListener('change', () => { if (preference.matches) video.pause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
  const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video.pause(); });
  observer.observe(video);
  source(); sync();
  root.querySelectorAll<HTMLElement>('[data-film-controls]').forEach((control) => { control.hidden = false; });
  root.setAttribute('data-film-ready', '');
}
