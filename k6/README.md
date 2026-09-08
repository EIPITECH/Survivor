# ⛰️ k6 load testing

Stress-tests the backend via `docker compose`, targeting `backend` directly. Reports land in [`k6/reports/`](/k6/reports/) as `.html` (visual, with median/p95/error % per metric) and `.json` (raw), as well as the default colored terminal version of `k6`.

## Prerequisites

1. Bring the backend up: `docker compose up -d --build`
2. Make sure the ~500-offers / ~50-county dataset is seeded (happens
   automatically on backend startup via `job.seeder.ts`. Check the backend's logs!)

## Run everything at once

```sh
docker compose --profile loadtest run --rm k6
```

This runs `main.js`, which starts all 5 scenarios **concurrently**: login, public job reads (+ view counter), map tiles, seeker profile read/write, and the full application workflow (seeker applies, employer reviews/updates status). One combined report is written to `k6/reports/stress-all.html`.

## Run a single scenario in isolation

```bash
docker compose --profile loadtest run --rm k6 run-jobs-read.js
docker compose --profile loadtest run --rm k6 run-tiles.js
docker compose --profile loadtest run --rm k6 run-login.js
docker compose --profile loadtest run --rm k6 run-profile.js
docker compose --profile loadtest run --rm k6 run-application-flow.js
```

Each writes its own report (e.g. `k6/reports/jobs-read.html`).
<!-- the nest server could use fcking benzodiazepines after  `run-tiles.js`. that thing is STRESSING HIM OUT -->

## Configuring virtual users / duration

Set environment variables before running (defaults shown are in [`.env.example`](/.env.example)), using the root `.env` file, or inline while running the tests :

```bash
K6_JOBS_READ_VUS=100 K6_JOBS_READ_DURATION=2m \
K6_TILES_VUS=50 \
docker compose --profile loadtest run --rm k6
```

| Variable                | Default | Scenario             |
|--------------------------|---------|-----------------------|
| `K6_POOL_SIZE`           | 30      | test accounts/jobs provisioned in setup |
| `K6_LOGIN_VUS/_DURATION` | 10 / 30s | login |
| `K6_JOBS_READ_VUS/_DURATION` | 20 / 30s | `/jobs/active`, `/jobs/active/grouped`, view counter |
| `K6_TILES_VUS/_DURATION` | 15 / 30s | `/tiles/{z}/{x}/{y}` |
| `K6_PROFILE_VUS/_DURATION` | 10 / 30s | `/seekers/me`, `/users/{id}` |
| `K6_APPFLOW_VUS/_DURATION` | 10 / 30s | apply + employer review/status update |

## Metrics

Every report includes, per endpoint/scenario tag: **median (p50)**, **p95**, and **% failed requests** (`http_req_failed`), plus thresholds that fail the run if p50/p95/error-rate exceed the configured limits (see [`config.js`](`/k6/lib/config.js`) and the `thresholds` block in [`main.js`](/k6/main.js#L62-L70)).

## Notes

- Setup ([`setup.js`](lib/setup.js)) creates real seeker/employer accounts + one job per  employer before the timed run starts, so the application-flow scenario has  real data to work against. This doesn't count toward the reported metrics.
- The seed dataset ([`job-offers.seed.json`](backend/src/jobs/data/job-offers.seed.json)) has 500  offers across 57 French counties; regenerate/resize it by editing  that file (or its generator script) directly.
