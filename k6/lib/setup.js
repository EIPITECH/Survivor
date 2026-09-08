import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, POOL_SIZE } from './config.js';
import { authHeaders, login, registerUser } from './helpers.js';

const PASSWORD = 'k6-load-test-pw'; // as long as it's >= 11 chars...

/**
 * Runs once before the load starts. Creates POOL_SIZE seeker accounts 
 * (each with a seeker profile) and POOL_SIZE employer accounts (each
 * owning one job), then returns everything the scenarios need. Shared
 * read-only across all virtual users.
 */
export function setupPool() {
  const seekers = [];
  const employers = [];

  for (let i = 0; i < POOL_SIZE; i++) {
    const email = `k6.seeker.${i}.${Date.now()}@load-test.local`;
    const createRes = registerUser({
      firstName: 'K6',
      lastName: `Seeker${i}`,
      email,
      password: PASSWORD,
      role: 'seeker',
    });
    const id = safeUserId(createRes);
    const token = login(email, PASSWORD);
    if (token) {
      const headers = authHeaders(token);
      http.post(
        `${BASE_URL}/seekers/me`,
        JSON.stringify({ skills: 'Load testing', experience: '1 year', availability: 'Immediate' }),
        headers,
      );
    }
    seekers.push({ email, password: PASSWORD, id });
  }

  for (let i = 0; i < POOL_SIZE; i++) {
    const email = `k6.employer.${i}.${Date.now()}@load-test.local`;
    registerUser({
      firstName: 'K6',
      lastName: `Employer${i}`,
      email,
      password: PASSWORD,
      role: 'employer',
    });
    const token = login(email, PASSWORD);
    let jobId = null;
    if (token) {
      const headers = authHeaders(token);
      const jobRes = http.post(
        `${BASE_URL}/jobs`,
        JSON.stringify({
          title: 'k6 Load Test Position',
          description: 'Job created by the k6 setup phase to support the application-flow scenario.',
          cityName: 'Rennes',
          streetNumber: 1,
          streetName: 'Rue de la Chalotais',
          zipCode: 35000,
          companyName: 'K6 Load Test Co.',
        }),
        headers,
      );
      check(jobRes, { 'setup job create: 2xx': (r) => r.status >= 200 && r.status < 300 });
      try {
        jobId = jobRes.json('id');
      } catch (e) {
        jobId = null;
      }
    }
    employers.push({ email, password: PASSWORD, jobId });
  }

  return { seekers, employers };
}

function safeUserId(res) {
  try {
    return res.json('id');
  } catch (e) {
    return null;
  }
}
