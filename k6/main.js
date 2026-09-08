/**
 * Combined stress test: runs every scenario concurrently against the
 * authenticated profile access, login, and the full application workflow
 * running docker compose stack, so it exercises jobs reads, tiles,
 * all at once. Virtual users, duration and other variables are configurable
 * per scenario in the 'run' files.
 * 
 * If all the workflows are run at once, only one report is created
 *  => stress-all.[html|json]
 */

import { SCENARIOS_CFG, DEFAULT_THRESHOLDS } from './lib/config.js';
import { setupPool } from './lib/setup.js';
import { buildHandleSummary } from './lib/report.js';

import { loginFlow } from './scenarios/login.js';
import { jobsReadFlow } from './scenarios/jobs-read.js';
import { tilesFlow } from './scenarios/tiles.js';
import { profileFlow } from './scenarios/profile.js';
import { applicationFlow } from './scenarios/application-flow.js';

// k6 resolves `exec` by looking up a matching export name on this file.
export const login        = loginFlow;
export const jobsRead     = jobsReadFlow;
export const tiles        = tilesFlow;
export const profile      = profileFlow;
export const application  = applicationFlow;

export const options = {
  scenarios: {
    login: {
      executor: 'constant-vus',
      exec: 'login',
      vus: SCENARIOS_CFG.login.vus,
      duration: SCENARIOS_CFG.login.duration,
    },
    jobs_read: {
      executor: 'constant-vus',
      exec: 'jobsRead',
      vus: SCENARIOS_CFG.jobsRead.vus,
      duration: SCENARIOS_CFG.jobsRead.duration,
    },
    tiles: {
      executor: 'constant-vus',
      exec: 'tiles',
      vus: SCENARIOS_CFG.tiles.vus,
      duration: SCENARIOS_CFG.tiles.duration,
    },
    profile: {
      executor: 'constant-vus',
      exec: 'profile',
      vus: SCENARIOS_CFG.profile.vus,
      duration: SCENARIOS_CFG.profile.duration,
    },
    application_flow: {
      executor: 'constant-vus',
      exec: 'application',
      vus: SCENARIOS_CFG.applicationFlow.vus,
      duration: SCENARIOS_CFG.applicationFlow.duration,
    },
  },
  thresholds: {
    ...DEFAULT_THRESHOLDS,
    // Per-scenario breakdown so a slow scenario doesn't get masked by fast ones.
    'http_req_duration{scenario:login}': ['p(50)<500', 'p(95)<1000'],
    'http_req_duration{scenario:jobs_read}': ['p(50)<500', 'p(95)<1000'],
    'http_req_duration{scenario:tiles}': ['p(50)<1000', 'p(95)<2500'],
    'http_req_duration{scenario:profile}': ['p(50)<600', 'p(95)<1200'],
    'http_req_duration{scenario:application_flow}': ['p(50)<800', 'p(95)<1500'],
  },
};

export function setup() {
  return setupPool();
}

export const handleSummary = buildHandleSummary('stress-all');
