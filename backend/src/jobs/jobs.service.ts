import { Injectable,BadRequestException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { jobStatus } from './enum/jobs-status.enum';
import { createReadStream } from 'fs';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto, employerId: number) {
    
    const adressUrl = `${createJobDto.streetNumber} ${createJobDto.streetName} ${createJobDto.zipCode} ${createJobDto.cityName}`;
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adressUrl)}&limit=1`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Communication avec l'API de géocodage impossible");
      }
      const data = await response.json();
      if (!data.features || data.features.length === 0) {
        throw new BadRequestException("L'adresse indiquée n'a pas pu être localisée");
      }
      const features = data.features[0];
      const longitude = features.geometry.coordinates[0];
      const latitude = features.geometry.coordinates[1];
      const score = features.properties.score;

      if (score < 0.2) {
        throw new BadRequestException("L'adresse indiquée n'a pas pu être vérifiée avec suffisamment de précision");
      }
      const newJob = new Job();
      if (score < 0.5) {
        newJob.status = jobStatus.TOCHECK;
      } else {
        newJob.status = jobStatus.ACTIVE;
      }

      newJob.title = createJobDto.title;
      newJob.employerId = employerId;
      newJob.description = createJobDto.description;
      newJob.cityName = createJobDto.cityName;
      newJob.streetNumber = createJobDto.streetNumber;
      newJob.streetName = createJobDto.streetName;
      newJob.zipCode = createJobDto.zipCode;
      newJob.latitude = latitude;
      newJob.geocodageSource = 'api-adresse.data.gouv.fr';
      newJob.longitude = longitude;
      newJob.trustScore = score;
      newJob.obtentionDate = new Date();
      newJob.companyName = createJobDto.companyName;
      return await this.jobRepo.save(newJob);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new BadRequestException(`Échec du géocodage : ${errorMessage}`)
    } 
  }


  async findAllActive() {
    const jobs = this.jobRepo.find({
      where: 
      {
        status: jobStatus.ACTIVE
      }
    });
    return jobs;
  }

  async findAll() {
    return this.jobRepo.find()
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    return this.jobRepo.update({ id }, updateJobDto);
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async migrationScript() 
  {
    
    const startTime = Date.now();
    const jobs = await this.jobRepo.find();

    let skipped = 0;
    let recovered = 0;
    let toCheck = 0;
    let failed = 0;

    console.log(' GéoEmploi - Script de reprise de géocodage');
    console.log(`Offres trouvées : ${jobs.length}`);
    console.log('');

    for (const job of jobs) {
        const alreadyGood =
            job.geocodageSource === 'api-adresse.data.gouv.fr' &&
            job.trustScore !== null &&
            job.trustScore !== undefined &&
            job.obtentionDate !== null &&
            job.obtentionDate !== undefined;

        if (alreadyGood) {
            console.log(
                `[SKIPPED] Offre #${job.id} "${job.title}" déjà valide`,
            );
            skipped++;
            continue;
        }
        const addressToCheck =
            `${job.streetNumber} ${job.streetName} ` +
            `${job.zipCode} ${job.cityName}`;
        console.log(
            `[CHECK] Offre #${job.id} - ${addressToCheck}`,
        );
        try {
            const url =
                `https://api-adresse.data.gouv.fr/search/?q=` +
                `${encodeURIComponent(addressToCheck)}&limit=1`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(
                    `Erreur de géocodage: ${response.status}`,
                );
            }
            const data = await response.json();
            if (!data.features || data.features.length === 0) {
                job.status = jobStatus.TOCHECK;

                await this.jobRepo.save(job);

                console.log(
                    `[TOCHECK] Offre #${job.id} : adresse introuvable`,
                );
                toCheck++;
                await this.sleep(200);
                continue;
            }

            const feature = data.features[0];

            const longitude =
                feature.geometry.coordinates[0];

            const latitude =
                feature.geometry.coordinates[1];

            const score =
                feature.properties.score;

            if (score < 0.7) {
                job.status = jobStatus.TOCHECK;

                await this.jobRepo.save(job);

                console.log(
                    `[TOCHECK] Offre #${job.id} : score de confiance trop faible (${score})`,
                );
                toCheck++;
                await this.sleep(200);
                continue;
            }

            job.longitude = longitude;
            job.latitude = latitude;

            job.geocodageSource =
                'api-adresse.data.gouv.fr';

            job.trustScore = score;
            job.obtentionDate = new Date();
            job.status = jobStatus.ACTIVE;
            await this.jobRepo.save(job);
            recovered++;
            console.log(
                `[REPRISE] Offre #${job.id} reprise: score ${score.toFixed(3)}`,
            );

        } catch (error) {
            failed++;
            console.error(
                `[ERROR] Offre #${job.id} :`,
                error instanceof Error
                    ? error.message
                    : 'Erreur inconnue',
            );
        }

        await this.sleep(200);
    }

    const duration = Date.now() - startTime;

    console.log('');
    console.log(' Résultat de la reprise');
    console.log('========================================');
    console.log(`Offres détectées :  ${jobs.length}`);
    console.log(`Déjà conformes :    ${skipped}`);
    console.log(`Offres reprises :   ${recovered}`);
    console.log(`À vérifier :        ${toCheck}`);
    console.log(`Échecs techniques : ${failed}`);
    console.log(`Durée :             ${duration} ms`);
  }
}
