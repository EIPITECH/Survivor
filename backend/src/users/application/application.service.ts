import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Seeker } from '../seekers/entities/seeker.entity'
import { Job } from '../../jobs/entities/job.entity';
import { Application } from './entities/application.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ApplicationService {
  constructor (
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
    
    @InjectRepository(Seeker)
    private seekerRepo: Repository<Seeker>,

    @InjectRepository(Job)
    private jobRepo: Repository<Job>
  ){}

  async create(jobId: number, userId: number, createApplicationDto: CreateApplicationDto) {
    
    const seeker = await this.seekerRepo.findOne(
      {
        where: {
          id: userId,
        },
      }
      );

      if (!seeker) {
        throw new NotFoundException('Candidat non trouvé');
      }

      const job = await this.jobRepo.findOne(
        {
          where: {
            id: jobId,
          },
        }
      );
      if (!job) {
        throw new NotFoundException('Offre d\'emploi non trouvée');
      }

      const alreadyApplied = await this.applicationRepo.findOne(
        {
          where: {
            seeker: {
              id: userId,
            },
            job: {
              id: jobId,
            }
          },
        }
      );

      if (alreadyApplied){
        throw new ConflictException('Le candidat à déjà candidaté à cette offre d\'emploi');
      }

      const application = this.applicationRepo.create({
        ...createApplicationDto,
        seeker,
        job,
      });

      return this.applicationRepo.save(application);
  }

  async findByUserId(userId: number) {
    const seeker = await this.seekerRepo.findOne({
        where: {
            user: {
                id: userId,
            },
        },
    });

    if (!seeker) {
        throw new NotFoundException('Seeker not found');
    }

    return this.applicationRepo.find({
        where: {
            seeker: {
                id: seeker.id,
            },
        },

        relations: {
            job: true,
        },

        order: {
            createdAt: 'DESC',
        },
    });
  }
}
