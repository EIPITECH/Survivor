import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../lib/config.js';
import { randomItem } from '../lib/helpers.js';

/**
 * Tiles are disk-cached (wmts-cache volume) after first fetch from the
 * upstream IGN WMTS service, so this endpoint's bottleneck profile
 * differs from the DB-bound endpoints.
 * 
 * We mix a small fixed "hot" pool (repeated => cache hits, once warmed)
 * with a wider random pool (first-hit => forces upstream fetch + write).
 */
const HOT_POOL = [];
for (let z = 5; z <= 9; z++) {
  const n = 2 ** z;
  const center = Math.floor(n / 2);
  for (let d = -2; d <= 2; d++) {
    HOT_POOL.push([z, center + d, center + d]);
  }
}

function randomTile() {
  const z = 5 + Math.floor(Math.random() * 6); // zoom 5 thru 10
  const n = 2 ** z;
  const x = Math.floor(Math.random() * n);
  const y = Math.floor(Math.random() * n);
  return [z, x, y];
}

export function tilesFlow() {
  // 70% hot/cached tiles, 30% cold/random tiles.
  const [z, x, y] = Math.random() < 0.7 ? randomItem(HOT_POOL) : randomTile();
  const res = http.get(`${BASE_URL}/tiles/${z}/${x}/${y}`);
  check(res, { 'tiles: 200': (r) => r.status === 200 });
}
