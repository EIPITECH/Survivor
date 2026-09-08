import { SCENARIOS_CFG, DEFAULT_THRESHOLDS } from './lib/config.js';
import { buildHandleSummary } from './lib/report.js';
import { jobsReadFlow } from './scenarios/jobs-read.js';

export const options = {
  vus: SCENARIOS_CFG.jobsRead.vus,
  duration: SCENARIOS_CFG.jobsRead.duration,
  thresholds: DEFAULT_THRESHOLDS,
};
export default jobsReadFlow;
export const handleSummary = buildHandleSummary('jobs-read');
