import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';

/**
 * Shared handleSummary used by every entrypoint script so all runs produce
 * the same three artifacts under k6/reports/ (also mounted to the host!):
 *   - summary.html  => visual report (median, p95, error% per metric/tag)
 *   - summary.json  => full raw metircs for CI/programmatic checks
 *   - stdout        => colored text summary
 */
export function buildHandleSummary(name) {
  return function handleSummary(data) {
    return {
      [`/reports/${name}.html`]: htmlReport(data),
      [`/reports/${name}.json`]: JSON.stringify(data, null, 2),
      stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
  };
}
