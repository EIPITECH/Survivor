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

  async create(userId: number, createApplicationDto: CreateApplicationDto) {
    
    const seeker = await this.seekerRepo.findOne(
      {
        where: {
          user: {
            id: userId,
          }
        },
      }
      );

      if (!seeker) {
        throw new NotFoundException('Candidat non trouvé');
      }

      const job = await this.jobRepo.findOne(
        {
          where: {
            id: createApplicationDto.jobId,
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
              id: seeker.id,
            },
            job: {
              id: job.id,
            }
          },
        }
      );

      if (alreadyApplied){
        throw new ConflictException('Le candidat à déjà candidaté à cette offre d\'emploi');
      }

      const application = this.applicationRepo.create({
        message: createApplicationDto.message,
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

  async findByEmployerId(employerId: number) {
    const applications = await this.applicationRepo.find({
      where: {
        job: {
          employerId: employerId,
        },
      },

      relations: {
        job: true,
        seeker: {
          user: true,
        },
      },

      order: {
        createdAt: 'DESC',
      },
    });

    return applications.map((application) => ({
      id: application.id,
      status: application.status,
      message: application.message,
      createdAt: application.createdAt,

      job: {
        id: application.job.id,
        title: application.job.title,
        companyName: application.job.companyName,
        cityName: application.job.cityName,
      },

      seeker: {
        id: application.seeker.id,
        skills: application.seeker.skills,
        experience: application.seeker.experience,
        availability: application.seeker.availability,

        user: {
          id: application.seeker.user.id,
          firstName: application.seeker.user.firstName,
          lastName: application.seeker.user.lastName,
          email: application.seeker.user.email,
        },
      },
    }));
  }


  async updateStatus(applicationId: number, employerId: number, updateApplicationDto: UpdateApplicationDto) 
  {
    const application = await this.applicationRepo.findOne({
      where: {
        id: applicationId,
        job: {
          employerId: employerId,
        },
      },

      relations: {
        job: true,
        seeker: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Candidature introuvable ou vous ne possédez pas cette offre');
    }

    application.status = updateApplicationDto.status;
    return this.applicationRepo.save(application);
  }
}
