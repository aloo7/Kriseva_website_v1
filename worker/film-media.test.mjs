import { test } from 'node:test';
import assert from 'node:assert/strict';
import { serveFilm } from './film-media.mjs';
const body = Uint8Array.from({ length: 10 }, (_, i) => i);
function assets(status = 200) {
  return { fetch: async (request) => {
    assert.equal(request.headers.get('Range'), null);
    return new Response(status === 200 ? body : null, { status, headers: { ETag: '"film-v1"', 'Last-Modified': 'Fri, 16 Oct 2026 00:00:00 GMT' } });
  } };
}
for (const [name, range, status, expected, contentRange] of [
  ['full request', undefined, 200, [...body], null],
  ['first two bytes', 'bytes=0-1', 206, [0, 1], 'bytes 0-1/10'],
  ['open end', 'bytes=7-', 206, [7, 8, 9], 'bytes 7-9/10'],
  ['suffix', 'bytes=-3', 206, [7, 8, 9], 'bytes 7-9/10'],
  ['end past length', 'bytes=8-999', 206, [8, 9], 'bytes 8-9/10'],
  ['oversized suffix', 'bytes=-99', 206, [...body], 'bytes 0-9/10'],
  ['unsatisfiable start', 'bytes=10-', 416, [], 'bytes */10'],
  ['inverted interval', 'bytes=8-2', 416, [], 'bytes */10'],
  ['zero suffix', 'bytes=-0', 416, [], 'bytes */10'],
  ['unsupported multiple ranges', 'bytes=0-1,5-6', 200, [...body], null],
  ['unknown range unit', 'items=1-2', 200, [...body], null],
]) test(name, async () => {
  const response = await serveFilm(new Request('https://example.test/media/kriseva-portrait.mp4', { headers: range ? { Range: range } : {} }), assets());
  assert.equal(response.status, status);
  assert.equal(response.headers.get('Content-Range'), contentRange);
  assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
  assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], expected);
});
test('HEAD ignores Range and returns full size without a body', async () => {
  const response = await serveFilm(new Request('https://example.test/film', { method: 'HEAD', headers: { Range: 'bytes=0-1' } }), assets());
  assert.equal(response.status, 200); assert.equal(response.headers.get('Content-Length'), '10'); assert.equal((await response.arrayBuffer()).byteLength, 0);
});
test('a stale If-Range validator returns the complete new file', async () => {
  const response = await serveFilm(new Request('https://example.test/film', { headers: { Range: 'bytes=0-1', 'If-Range': '"old-film"' } }), assets());
  assert.equal(response.status, 200); assert.equal((await response.arrayBuffer()).byteLength, 10);
});
test('a matching If-Range validator permits seeking', async () => {
  const response = await serveFilm(new Request('https://example.test/film', { headers: { Range: 'bytes=0-1', 'If-Range': '"film-v1"' } }), assets());
  assert.equal(response.status, 206);
});
test('missing assets retain the asset binding failure', async () => {
  const response = await serveFilm(new Request('https://example.test/film'), assets(404)); assert.equal(response.status, 404);
});
