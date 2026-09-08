// Central place for configuration so every scenario file (and the
// combined runner) reads settings the same way.

export const BASE_URL = __ENV.BASE_URL || 'http://backend:3000';

// Generic helper: read an int env var with a fallback.
export function envInt(name, fallback) {
  const v = __ENV[name];
  if (v === undefined || v === '') return fallback;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

export function envStr(name, fallback) {
  return __ENV[name] && __ENV[name] !== '' ? __ENV[name] : fallback;
}

// How many seeker/employer test accounts (and jobs) to provision once in
// setup() for scenarios that need authenticated data (profile, application
// flow). Independent from VUs: many VUs share/reuse this pool!
export const POOL_SIZE = envInt('POOL_SIZE', 30);

// Per-scenario virtual user counts and durations, all independently
// configurable so you can dial in stress-all or isolate one target
// at a time.
export const SCENARIOS_CFG = {
  login: {
    vus: envInt('LOGIN_VUS', 10),
    duration: envStr('LOGIN_DURATION', '30s'),
  },
  jobsRead: {
    vus: envInt('JOBS_READ_VUS', 20),
    duration: envStr('JOBS_READ_DURATION', '30s'),
  },
  tiles: {
    vus: envInt('TILES_VUS', 15),
    duration: envStr('TILES_DURATION', '30s'),
  },
  profile: {
    vus: envInt('PROFILE_VUS', 10),
    duration: envStr('PROFILE_DURATION', '30s'),
  },
  applicationFlow: {
    vus: envInt('APPFLOW_VUS', 10),
    duration: envStr('APPFLOW_DURATION', '30s'),
  },
};

// Shared response-time / error-rate thresholds. p(50) = median.
export const DEFAULT_THRESHOLDS = {
  http_req_duration: ['p(50)<800', 'p(95)<1500'],
  http_req_failed: ['rate<0.5'],
};
