// Optional atmosphere, never a source of content. The SVG and CSS surface
// remain complete when WebGL, JavaScript or motion are unavailable.
import { ShaderMount, meshGradientFragmentShader, getShaderColorFromString } from '@paper-design/shaders';
export async function initCrossingAtmosphere(root: HTMLElement): Promise<void> {
  const host = root.querySelector<HTMLElement>('[data-atmosphere]');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (!host || preference.matches || connection?.saveData) return;

  // Check capability before loading the renderer. Release the probe context.
  const probe = document.createElement('canvas');
  const gl = probe.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
  if (!gl) return;
  gl.getExtension('WEBGL_lose_context')?.loseContext();

  try {
    if (!host.isConnected) return;
    const shader = new ShaderMount(host, meshGradientFragmentShader, {
      u_colors: ['#e2edff', '#f6f9fd', '#c9ddf4', '#eef3fb'].map(getShaderColorFromString),
      u_colorsCount: 4, u_distortion: .18, u_swirl: .12,
      u_grainMixer: 0, u_grainOverlay: .015,
      u_originX: .5, u_originY: .5, u_worldWidth: 0, u_worldHeight: 0,
      u_fit: 2, u_scale: 1, u_rotation: 0, u_offsetX: 0, u_offsetY: 0,
    }, { alpha: false, antialias: false, powerPreference: 'low-power' }, 0, 1800, 1, 750_000);
    root.dataset.atmosphere = 'ready';
    let visible = true, failed = false;
    const sync = () => { if (!failed) shader.setSpeed(visible && !document.hidden && !preference.matches && !root.hasAttribute('data-paused') ? .12 : 0); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(host);
    const state = new MutationObserver(sync);
    state.observe(root, { attributes: true, attributeFilter: ['data-paused'] });
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    shader.canvasElement.addEventListener('webglcontextlost', () => {
      failed = true; shader.setSpeed(0); shader.dispose();
      root.dataset.atmosphere = 'fallback'; host.replaceChildren();
    }, { once: true });
    addEventListener('pagehide', (event) => {
      if (event.persisted) { shader.setSpeed(0); return; }
      observer.disconnect(); state.disconnect();
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      shader.dispose();
    });
    addEventListener('pageshow', sync);
    sync();
  } catch {
    // Unsupported or exhausted GPU contexts leave the original CSS surface.
    root.dataset.atmosphere = 'fallback';
    host.replaceChildren();
  }
}
