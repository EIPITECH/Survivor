import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import AdminSeeder from './users/admin.seeder';
import JobSeeder from './jobs/job.seeder';
import { JobsService } from './jobs/jobs.service';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jobsService: JobsService,
  ) {}

  async onApplicationBootstrap() {
    try {
      const adminSeeder = new AdminSeeder();
      await adminSeeder.run(this.dataSource);
    } catch (error) {
      console.log('Impossible de créer le compte admin : ', error);
    }

    try {
      const jobSeeder = new JobSeeder();
      await jobSeeder.run(this.dataSource, this.jobsService);
    } catch (error) {
      console.log("Impossible de seed les offres d'emploi : ", error);
    }
  }
}
