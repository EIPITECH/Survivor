import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { jobStatus } from './enum/jobs-status.enum';

const GEOCODE_SOURCE = 'api-adresse.data.gouv.fr';
const ACTIVE_SCORE_THRESHOLD = 0.5;
const REQUEST_DELAY_MS = 22; // ~45 req/s maximum
const MAX_RETRIES = 5;
const MAX_CONSECUTIVE_FAILURES = 8;

// Thrown when the API keeps refusing us (429) even after waiting REQUEST_DELAY_MS
class RateLimitExceededError extends Error {}

interface DisplacementRecord {
  jobId: number;
  title: string;
  address: string;
  oldLatitude: number;
  oldLongitude: number;
  newLatitude: number;
  newLongitude: number;
  distanceMeters: number;
}

export interface MigrationReport {
  totalJobs: number;
  skipped: number;
  recovered: number;
  toCheck: number;
  failed: number;
  interrupted: boolean;
  interruptedReason?: string;
  durationMs: number;
  averageDisplacementMeters: number;
  displacementsMeasured: number;
  topDisplacements: DisplacementRecord[];
}

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto, employerId: number) {
    
    const adressUrl = `${createJobDto.streetNumber} ${createJobDto.streetName} ${createJobDto.zipCode} ${createJobDto.cityName}`;
    const url = `https://${GEOCODE_SOURCE}/search/?q=${encodeURIComponent(adressUrl)}&limit=1`;

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
      if (score < ACTIVE_SCORE_THRESHOLD) {
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
      newJob.geocodageSource = GEOCODE_SOURCE;
      newJob.longitude = longitude;
      newJob.trustScore = score;
      newJob.obtentionDate = new Date();
      newJob.companyName = createJobDto.companyName;
      return await this.jobRepo.save(newJob);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new BadRequestException(`Échec du géocodage : ${errorMessage}`);
    }
  }

  async findAllActive() {
    return this.jobRepo.find({ where: { status: jobStatus.ACTIVE } });
  }

  // Need to wire this to the admin panel so they can be manually checked 
  async findAllToCheck() {
    return this.jobRepo.find({ where: { status: jobStatus.TOCHECK } });
  }

  async findAll() {
    return this.jobRepo.find();
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    return this.jobRepo.update({ id }, updateJobDto);
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private haversineDistanceMeters(
    lat1: number, lon1: number,
    lat2: number, lon2: number,
  ): number {
    const R = 6371000; // Earth radius, meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calls the API Adresse with retry & backoff. On a 429 it respects
   * Retry-After (if present) otherwise backs off exponentially. After
   * MAX_RETRIES consecutive 429s, gives up loudly (RateLimitExceededError)
   */
  private async geocode(address: string): Promise<any> {
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}&limit=1`;
    let delay = 500;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const response = await fetch(url);

      if (response.status === 429) {
        if (attempt === MAX_RETRIES) {
          throw new RateLimitExceededError(
            `Limite de débit de l'API Adresse atteinte après ${MAX_RETRIES} tentatives`,
          );
        }
        const retryAfterHeader = response.headers.get('Retry-After');
        const waitMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : delay;
        console.warn(
          `[RATE-LIMIT] 429 reçu, pause de ${waitMs}ms (tentative ${attempt + 1}/${MAX_RETRIES})`,
        );
        await this.sleep(waitMs);
        delay *= 2;
        continue;
      }

      if (!response.ok) {
        if (response.status >= 500 && attempt < MAX_RETRIES) {
          await this.sleep(delay);
          delay *= 2;
          continue;
        }
        throw new Error(`Erreur de géocodage: ${response.status}`);
      }

      return await response.json();
    }
    throw new RateLimitExceededError("Nombre maximal de tentatives atteint");
  }

  /**
   * - Idempotence: a job is only skipped if it already has GEOCODE_SOURCE,
   *   a trustScore and an obtentionDate. Anything geocoded by the old
   *   provider, anything left TOCHECK, and anything that failed last time
   *   (network or rate-limit) will be retried on the next run automatically.
   * 
   * - Never deletes or blanks a job: on failure to resolve, status becomes
   *   TOCHECK and the previous fields are left untouched. TOCHECK jobs are
   *   excluded from findAllActive(), so nothing that's in the middle of
   *   the Atlantic reaches the public map.
   * 
   * - Stops the whole batch if it detects it's being throttled/cut off,
   *   so a rerun later resumes cleanly.
   * 
   * - Measures how far each successfully re-geocoded job moved from its
   *   previous coordinates, in meters, before overwriting them.
   */
    async migrationScript(): Promise<MigrationReport> {
      const startTime = Date.now();
      const jobs = await this.jobRepo.find();
  
      let skipped = 0;
      let recovered = 0;
      let toCheck = 0;
      let failed = 0;
      let consecutiveFailures = 0;
      let interrupted = false;
      let interruptedReason: string | undefined;
  
      const displacements: DisplacementRecord[] = [];
  
      console.log('GéoEmploi - Script de migration');
      console.log(`Offres trouvées : ${jobs.length}\n`);
  
      for (const job of jobs) {
        const alreadyGood =
          job.geocodageSource === GEOCODE_SOURCE &&
          job.trustScore !== null && job.trustScore !== undefined &&
          job.obtentionDate !== null && job.obtentionDate !== undefined;
  
        if (alreadyGood) {
          console.log(`[SKIPPED] Offre #${job.id} déjà valide`);
          skipped++; continue;
        }
  
        const addressToCheck = `${job.streetNumber} ${job.streetName} ${job.zipCode} ${job.cityName}`;
        const addressShort = addressToCheck.substring(0, 16);
        console.log(`[CHECK] Offre #${job.id} : ${addressShort}${addressShort.length < addressToCheck.length ? '...' : ''}`);
  
        try {
          const data = await this.geocode(addressToCheck);
          consecutiveFailures = 0;
  
          if (!data.features || data.features.length === 0) {
            job.status = jobStatus.TOCHECK;
            await this.jobRepo.save(job);
            console.log(`[TOCHECK] Offre #${job.id} : adresse introuvable`);
            toCheck++;
            await this.sleep(REQUEST_DELAY_MS);
            continue;
          }
  
          const feature = data.features[0];
          const longitude = feature.geometry.coordinates[0];
          const latitude = feature.geometry.coordinates[1];
          const score = feature.properties.score;
  
          if (score < ACTIVE_SCORE_THRESHOLD) {
            job.status = jobStatus.TOCHECK;
            await this.jobRepo.save(job);
            console.log(
              `[TOCHECK] Offre #${job.id} : score de confiance trop faible (${score})`,
            );
            toCheck++;
            await this.sleep(REQUEST_DELAY_MS);
            continue;
          }
  
          const hadPreviousCoordinates =
            job.latitude !== null && job.latitude !== undefined &&
            job.longitude !== null && job.longitude !== undefined;
  
          if (hadPreviousCoordinates) {
            const distanceMeters = this.haversineDistanceMeters(
              job.latitude, job.longitude, latitude, longitude,
            );
            displacements.push({
              jobId: job.id,
              title: job.title,
              address: addressToCheck,
              oldLatitude: job.latitude,
              oldLongitude: job.longitude,
              newLatitude: latitude,
              newLongitude: longitude,
              distanceMeters,
            });
          }
  
          job.longitude = longitude;
          job.latitude = latitude;
          job.geocodageSource = GEOCODE_SOURCE;
          job.trustScore = score;
          await this.jobRepo.save(job);
          recovered++;
          console.log(`[REPRISE] Offre #${job.id} reprise: score ${score.toFixed(3)}`);
        } catch (error) {
          if (error instanceof RateLimitExceededError) {
            interrupted = true;
            interruptedReason = error.message;
            console.error(
              `[STOP] Reprise interrompue : ${error.message}. Relancez la commande plus tard, elle reprendra là où elle s'est arrêtée.`,
            );
            break;
          }

          failed++;
          consecutiveFailures++;
          console.error(
            `[ERROR] Offre #${job.id} :`,
            error instanceof Error ? error.message : 'Erreur inconnue',
          );
  
          if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
            interrupted = true;
            interruptedReason = `${MAX_CONSECUTIVE_FAILURES} échecs consécutifs`;
            console.error(
              `[STOP] ${consecutiveFailures} échecs consécutifs, arrêt du batch par précaution. Relancez la commande plus tard.`,
            );
            break;
          }
        }
  
        await this.sleep(REQUEST_DELAY_MS);
      }
  
      const durationMs = Date.now() - startTime;
      const averageDisplacementMeters =
        displacements.length > 0
          ? displacements.reduce((sum, d) => sum + d.distanceMeters, 0) / displacements.length
          : 0;
      const topDisplacements = [...displacements]
        .sort((a, b) => b.distanceMeters - a.distanceMeters)
        .slice(0, 5);
  
      console.log('');
      console.log(' Résultat de la reprise');
      console.log('========================================');
      console.log(`Offres détectées :        ${jobs.length}`);
      console.log(`Déjà conformes :          ${skipped}`);
      console.log(`Offres reprises :         ${recovered}`);
      console.log(`À vérifier :              ${toCheck}`);
      console.log(`Échecs techniques :       ${failed}`);
      if (interrupted) {
        console.log(`Interrompue :             oui (${interruptedReason})`);
      }
      console.log(`Déplacement moyen :       ${averageDisplacementMeters.toFixed(1)}m (sur ${displacements.length} offres)`);
      console.log(`Durée :                   ${durationMs} ms`);
      console.log('');
      console.log(' Cinq déplacements les plus importants');
      console.log('----------------------------------------');
      topDisplacements.forEach((d, i) => {
        console.log(
          `#${i + 1}. Offre #${d.jobId} "${d.title}" :: ${d.address} :: ${d.distanceMeters.toFixed(0)}m (${d.oldLatitude.toFixed(5)},${d.oldLongitude.toFixed(5)}`
        );
        console.log(`      → ${d.newLatitude.toFixed(5)},${d.newLongitude.toFixed(5)})`);
      });
  
      return {
        totalJobs: jobs.length,
        skipped,
        recovered,
        toCheck,
        failed,
        interrupted,
        interruptedReason,
        durationMs,
        averageDisplacementMeters,
        displacementsMeasured: displacements.length,
        topDisplacements,
      };
  }

  async findMine(employerId: number) {
    return this.jobRepo.find({
      where: {
        employerId: employerId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
