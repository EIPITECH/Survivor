/**
 * Commande unique de reprise de géocodage.
 *
 * Usage : `ts-node -r tsconfig-paths/register src/geocodage/migration.script.ts`
 *    Ou : `npm run migrate:geocoding`
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { JobsService } from '../jobs/jobs.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const jobsService = app.get(JobsService);

  try {
    const report = await jobsService.migrationScript();

    // LINK TO ADMINISTRATOR PANEL INSTEAD OF CONSOLE.LOG()
    console.log('\nRapport de migration :');
    console.log(JSON.stringify(report, null, 2));

    process.exitCode = report.interrupted ? 1 : 0;
  } finally {
    await app.close();
  }
}

bootstrap();