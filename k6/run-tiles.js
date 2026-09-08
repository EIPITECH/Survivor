import { SCENARIOS_CFG, DEFAULT_THRESHOLDS } from './lib/config.js';
import { buildHandleSummary } from './lib/report.js';
import { tilesFlow } from './scenarios/tiles.js';

export const options = {
  vus: SCENARIOS_CFG.tiles.vus,
  duration: SCENARIOS_CFG.tiles.duration,
  thresholds: DEFAULT_THRESHOLDS,
};
export default tilesFlow;
export const handleSummary = buildHandleSummary('tiles');
