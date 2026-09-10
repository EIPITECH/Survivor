import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../lib/config.js';

/**
 * Unauthenticated, read-heavy: the 500-offer / 57-county dataset makes
 * these the endpoints most probable to get high traffic.
 */
export function jobsReadFlow() {
  const active = http.get(`${BASE_URL}/jobs/active`);
  check(active, { 'jobs/active: 200': (r) => r.status === 200 });

  const grouped = http.get(`${BASE_URL}/jobs/active/grouped`);
  check(grouped, { 'jobs/active/grouped: 200': (r) => r.status === 200 });

  // simulate a user opening a job listing
  try {
    const jobs = active.json();
    if (Array.isArray(jobs) && jobs.length > 0) {
      const job = jobs[Math.floor(Math.random() * jobs.length)];
      const viewRes = http.post(`${BASE_URL}/jobs/${job.id}/view`);
      check(viewRes, { 'jobs/:id/view: 2xx': (r) => r.status >= 200 && r.status < 300 });
    }
  } catch (e) {
    // ignore parse issues, already captured by the check above
  }

  sleep(1);
}
