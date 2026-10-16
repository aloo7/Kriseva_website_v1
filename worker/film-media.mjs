// Byte-range delivery for the two small, public explainer files. The asset
// binding can return a full 200 even for Range requests; browsers then cannot
// advertise the whole film as seekable while it downloads.
export const FILM_PATHS = new Set(['/media/kriseva-portrait.mp4', '/media/kriseva-wide.mp4']);

export async function serveFilm(request, assets) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  const range = request.method === 'GET' ? request.headers.get('Range') : null;
  const upstreamHeaders = new Headers(request.headers);
  upstreamHeaders.delete('Range');
  upstreamHeaders.delete('If-Range');
  upstreamHeaders.set('Accept-Encoding', 'identity');
  if (range) upstreamHeaders.delete('If-None-Match');
  const asset = await assets.fetch(new Request(request.url, { method: 'GET', headers: upstreamHeaders }));
  if (asset.status !== 200) return asset;
  const bytes = await asset.arrayBuffer();
  const size = bytes.byteLength;
  const headers = new Headers(asset.headers);
  headers.set('Content-Type', 'video/mp4');
  headers.set('Content-Length', String(size));
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.delete('Content-Encoding');
  headers.delete('Content-Range');
  if (request.method === 'HEAD') return new Response(null, { status: 200, headers });

  const ifRange = request.headers.get('If-Range');
  let rangeAllowed = !ifRange;
  if (ifRange) {
    const modified = Date.parse(headers.get('Last-Modified') || '');
    const validator = Date.parse(ifRange);
    rangeAllowed = (!ifRange.startsWith('W/') && ifRange === headers.get('ETag'))
      || (Number.isFinite(modified) && Number.isFinite(validator) && modified <= validator);
  }
  const match = rangeAllowed && range?.match(/^bytes=(\d*)-(\d*)$/);
  if (!match || (!match[1] && !match[2])) return new Response(bytes, { status: 200, headers });
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || start > end || (!match[1] && Number(match[2]) === 0)) {
    headers.set('Content-Range', `bytes */${size}`);
    headers.set('Content-Length', '0');
    return new Response(null, { status: 416, headers });
  }
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  return new Response(bytes.slice(start, end + 1), { status: 206, headers });
}
