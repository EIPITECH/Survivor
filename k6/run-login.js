import { SCENARIOS_CFG, DEFAULT_THRESHOLDS } from './lib/config.js';
import { setupPool } from './lib/setup.js';
import { buildHandleSummary } from './lib/report.js';
import { loginFlow } from './scenarios/login.js';

export const options = {
  vus: SCENARIOS_CFG.login.vus,
  duration: SCENARIOS_CFG.login.duration,
  thresholds: DEFAULT_THRESHOLDS,
};
export function setup() { return setupPool(); }
export default loginFlow;
export const handleSummary = buildHandleSummary('login');
