import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './config.js';

const JSON_HEADERS = { headers: { 'Content-Type': 'application/json' } };

export function authHeaders(token) {
  return { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
}

// Registers a user (ignores 400/409 if it already exists.
// Don't want the tests to stop if the job's already done ;)
export function registerUser(user) {
  const res = http.post(`${BASE_URL}/users`, JSON.stringify(user), JSON_HEADERS);
  check(res, { 'register: 2xx or already exists': (r) => r.status === 201 || r.status === 400 || r.status === 409 });
  return res;
}

// Logs a user in and returns the access token, or null on failure.
export function login(email, password) {
  const res = http.post(`${BASE_URL}/auth/login`, JSON.stringify({ email, password }), JSON_HEADERS);
  const ok = check(res, { 'login: 200': (r) => r.status === 200 });
  if (!ok) return null;
  try {
    return res.json('accessToken') || res.json('access_token') || res.json('token');
  } catch (e) {
    return null;
  }
}

export function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
