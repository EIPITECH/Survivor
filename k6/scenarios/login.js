import { sleep } from 'k6';
import { login, randomItem } from '../lib/helpers.js';

/**
 * data.accounts is the pool created in setup()
 * (see main.js / setup.js)
 */
export function loginFlow(data) {
  const account = randomItem(data.seekers.concat(data.employers));
  login(account.email, account.password);
  sleep(1);
}
