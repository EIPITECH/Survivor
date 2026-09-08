import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../lib/config.js';
import { authHeaders, login, randomItem } from '../lib/helpers.js';

/**
 * Realistic multi-step journey:
 *    seeker: login => browse active jobs => apply to one
 *    employer: login => view received applications => update a status
 * Each iteration picks a fresh (seeker, employer+job) pair from the pool
 * built in setup(), so most applications succeed (201). A 409 (already
 * applied) is a legitimate business outcome, not a load-test failure.
 */
export function applicationFlow(data) {
  const seeker = randomItem(data.seekers);
  const employer = randomItem(data.employers);

  // Seekers' side
  const seekerToken = login(seeker.email, seeker.password);
  if (seekerToken) {
    const sHeaders = authHeaders(seekerToken);

    const activeRes = http.get(`${BASE_URL}/jobs/active`);
    check(activeRes, { 'appflow jobs/active: 200': (r) => r.status === 200 });

    let jobId = employer.jobId; // guaranteed to exist (created in setup)
    try {
      const jobs = activeRes.json();
      if (Array.isArray(jobs) && jobs.length > 0) {
        jobId = randomItem(jobs).id;
      }
    } catch (e) { /* fall back to employer.jobId */ }

    const applyRes = http.post(
      `${BASE_URL}/applications`,
      JSON.stringify({ jobId, message: 'k6 load test application' }),
      sHeaders,
    );
    check(applyRes, {
      'appflow apply: 201 or 409 (dup)': (r) => r.status === 201 || r.status === 409,
    });

    const mineRes = http.get(`${BASE_URL}/applications`, sHeaders);
    check(mineRes, { 'appflow applications GET: 200': (r) => r.status === 200 });
  }

  sleep(1);

  // Employers' side
  const employerToken = login(employer.email, employer.password);
  if (employerToken) {
    const eHeaders = authHeaders(employerToken);

    const receivedRes = http.get(`${BASE_URL}/applications/employer`, eHeaders);
    check(receivedRes, { 'appflow applications/employer: 200': (r) => r.status === 200 });

    try {
      const applications = receivedRes.json();
      if (Array.isArray(applications) && applications.length > 0) {
        const application = randomItem(applications);
        const statuses = ['accepted', 'rejected'];
        const statusRes = http.patch(
          `${BASE_URL}/applications/${application.id}/status`,
          JSON.stringify({ status: randomItem(statuses) }),
          eHeaders,
        );
        check(statusRes, { 'appflow status PATCH: 2xx': (r) => r.status >= 200 && r.status < 300 });
      }
    } catch (e) {
      // no applications yet for this employer :( nothing to update
    }
  }

  sleep(1);
}
