import { SCENARIOS_CFG, DEFAULT_THRESHOLDS } from './lib/config.js';
import { setupPool } from './lib/setup.js';
import { buildHandleSummary } from './lib/report.js';
import { applicationFlow } from './scenarios/application-flow.js';

export const options = {
  vus: SCENARIOS_CFG.applicationFlow.vus,
  duration: SCENARIOS_CFG.applicationFlow.duration,
  thresholds: DEFAULT_THRESHOLDS,
};
export function setup() { return setupPool(); }
export default applicationFlow;
export const handleSummary = buildHandleSummary('application-flow');
