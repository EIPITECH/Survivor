import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../lib/config.js';
import { authHeaders, login, randomItem } from '../lib/helpers.js';

// Authenticated read + write on the seeker's own profile.
export function profileFlow(data) {
  const account = randomItem(data.seekers);
  const token = login(account.email, account.password);
  if (!token) return;
  const headers = authHeaders(token);

  const getRes = http.get(`${BASE_URL}/seekers/me`, headers);
  check(getRes, { 'seekers/me GET: 200': (r) => r.status === 200 });

  const patchRes = http.patch(
    `${BASE_URL}/seekers/me`,
    JSON.stringify({ skills: `k6-load-test-${Date.now()}` }),
    headers,
  );
  check(patchRes, { 'seekers/me PATCH: 2xx': (r) => r.status >= 200 && r.status < 300 });

  const userRes = http.get(`${BASE_URL}/users/${account.id}`, headers);
  check(userRes, { 'users/:id GET: 200': (r) => r.status === 200 });

  sleep(1);
}
