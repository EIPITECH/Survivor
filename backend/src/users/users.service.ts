import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Job } from '../jobs/entities/job.entity';
import { UserRole } from './enum/user-role.enum';
import { Seeker } from './seekers/entities/seeker.entity';
import { Application } from './application/entities/application.entity';
import { Consent } from './consent/entities/consent.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
    @InjectRepository(Seeker)
    private seekerRepo: Repository<Seeker>,
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
    @InjectRepository(Consent)
    private consentRepo: Repository<Consent>,

  ) {}

  private async hashString(str: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(str, saltRounds);
  }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepo.findOneBy({ email: createUserDto.email });
    if (userExists) {
      throw new ConflictException(
        "Un utilisateur avec cette adresse email existe déjà"
      );
    }

    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.isConnected = false;
    user.role = createUserDto.role;
    user.password = await this.hashString(createUserDto.password);
    return this.userRepo.save(user);
  }

  async findAll() {
    return this.userRepo.find({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isConnected: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    return this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isConnected: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async remove(id: number) 
  {
    const user = await this.userRepo.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    if (user.role === UserRole.EMPLOYER) {
      await this.jobRepo.delete({employerId: id});
    }

    await this.userRepo.delete({id});

    return {
      message: "Compte supprimé avec succès",
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update({ id }, updateUserDto);
  }

  async exportPersonalData(userId: number) 
  {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isConnected: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const consents = await this.consentRepo.find({
      where: {
        user: {
          id: userId,
        },
      },

      select: {
        id: true,
        type: true,
        granted: true,
        noticeVersion: true,
        createdAt: true,
      },

      order: {
        createdAt: 'ASC',
      },
  });


  const exportData: any = {
    exportedAt: new Date(),

    account: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isConnected: user.isConnected,
      createdAt: user.createdAt,
    },

    consents,
  };

  if (user.role === UserRole.SEEKER) {
    const seeker = await this.seekerRepo.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!seeker) {
      exportData.professionalProfile = null;
      exportData.applications = [];

      return exportData;
    }


    exportData.professionalProfile = {
      id: seeker.id,
      skills: seeker.skills,
      experience: seeker.experience,
      availability: seeker.availability,
    };


    const applications =
      await this.applicationRepo.find({
        where: {
          seeker: {
            id: seeker.id,
          },
        },

        relations: {
          job: true,
        },

        order: {
          createdAt: 'ASC',
        },
      });


    exportData.applications = applications.map(
      (application) => ({
        id: application.id,
        status: application.status,
        message: application.message,
        createdAt: application.createdAt,

        job: {
          id: application.job.id,
          title: application.job.title,
          companyName:
            application.job.companyName,
          cityName:
            application.job.cityName,
        },
      }),
    );
  }
    if (user.role === UserRole.EMPLOYER) {
      const jobs = await this.jobRepo.find({
        where: {
          employerId: userId,
        },
      
        order: {
          createdAt: 'ASC',
        },
      });
    
    
      exportData.jobs = jobs.map((job) => ({
        id: job.id,
        title: job.title,
        description: job.description,
      
        companyName: job.companyName,
      
        streetNumber: job.streetNumber,
        streetName: job.streetName,
        zipCode: job.zipCode,
        cityName: job.cityName,
      
        latitude: job.latitude,
        longitude: job.longitude,
      
        status: job.status,
      
        geocodageSource: job.geocodageSource,
        trustScore: job.trustScore,
        obtentionDate: job.obtentionDate,
      
        createdAt: job.createdAt,
      }));
    }
  
  
    return exportData;
  }
}