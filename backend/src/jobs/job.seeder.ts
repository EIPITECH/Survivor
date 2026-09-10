import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Job } from './entities/job.entity';
import { JobsService, MAX_CONSECUTIVE_FAILURES } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import SEEDED_JOB_OFFERS from './data/job-offers.seed.json';

// Looaded from ./data/job-offers.seed.json
// => (500 offers spread across 57 French counties/départements)
const RENNES_JOB_OFFERS: CreateJobDto[] = SEEDED_JOB_OFFERS as CreateJobDto[];

export default class JobSeeder {
  async run(dataSource: DataSource, jobsService: JobsService) {
 
    const userRepository = dataSource.getRepository(User);
    const jobRepository = dataSource.getRepository(Job);
 
    const admin = await userRepository.findOneBy({ email: 'admin@job-et-bonheur.fr' });
    if (!admin) {
      console.log("Compte administrateur introuvable, seed des offres d'emploi annulé");
      return;
    }
 
    const existingJobsCount = await jobRepository.count();
    if (existingJobsCount > 0) {
      console.log("Des offres d'emploi existent déjà, seed ignoré");
      return;
    }
 
    console.log(`Création de ${RENNES_JOB_OFFERS.length} offres d'emploi`);
 
    let created = 0;
    let failed = 0;
 
    for (const offer of RENNES_JOB_OFFERS) {
      try {
        await jobsService.create(offer, admin.id);
        created++;
      } catch (error) {
        failed++;
        console.log(
          `Échec de création pour "${offer.title}" à ${offer.cityName} :`,
          error instanceof Error ? error.message : error,
        );
      }
      if (failed >= MAX_CONSECUTIVE_FAILURES) { break; }
    }
 
    console.log(`Offres créées : ${created}, échecs : ${failed}`);
  }
}
