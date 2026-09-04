import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(process.cwd(), '../.env'),
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { JobsService } from '../jobs/jobs.service';

async function main() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const jobsService = app.get(JobsService);

    await jobsService.migrationScript();

    await app.close();
}

main().catch((error) => {
    console.error('Erreur fatale :', error);
    process.exit(1);
});