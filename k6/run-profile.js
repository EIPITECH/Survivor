import { SCENARIOS_CFG, DEFAULT_THRESHOLDS } from './lib/config.js';
import { setupPool } from './lib/setup.js';
import { buildHandleSummary } from './lib/report.js';
import { profileFlow } from './scenarios/profile.js';

export const options = {
  vus: SCENARIOS_CFG.profile.vus,
  duration: SCENARIOS_CFG.profile.duration,
  thresholds: DEFAULT_THRESHOLDS,
};
export function setup() { return setupPool(); }
export default profileFlow;
export const handleSummary = buildHandleSummary('profile');
