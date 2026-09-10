import { Injectable, ConflictException, BadRequestException, ForbiddenException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
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
import { UserAccountStatus } from './enum/user-account-status.enum';
import { CreateAdminDto } from './dto/create-admin.dto';

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
      throw new ConflictException("Un utilisateur avec cette adresse email existe déjà");
    }

    if (createUserDto.role === UserRole.EMPLOYER) {
      const siret = createUserDto.siret;

      if (!siret) {
          throw new BadRequestException('Le SIRET est obligatoire pour créer un compte employeur');
      }

      if (!this.isValidSiretLuhn(siret)) {
          throw new BadRequestException('Le numéro SIRET est invalide');
      }

      const siretExists = await this.verifySiretExists(siret);
      if (!siretExists) {
          throw new BadRequestException('Aucun entreprise correspondant à ce SIRET n’a été trouvé');
      }
    }

    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.isConnected = false;
    user.accountStatus = UserAccountStatus.ACTIVE;
    user.siret = createUserDto.role === UserRole.EMPLOYER ? createUserDto.siret! : null;
    if (createUserDto.role == UserRole.ADMIN) {
      throw new ForbiddenException("Vous ne pouvez pas vous inscrire en tant qu'administrateur");
    }
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
        accountStatus: true,
        siret: true,
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
        accountStatus: true,
        siret: true,
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

  async update(id: number, updateUserDto: UpdateUserDto) 
  {
    if (updateUserDto.password) {
        updateUserDto.password = await this.hashString(updateUserDto.password);
    }
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
        accountStatus: true,
        siret: true,
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
      accountStatus: user.accountStatus,
      isConnected: user.isConnected,
      siret: user.siret,
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


  async updateAccountStatus(id: number, status: UserAccountStatus, adminId: number) 
  {
    const user = await this.userRepo.findOneBy({id});

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (user.id === adminId && status === UserAccountStatus.SUSPENDED) {
      throw new ForbiddenException('Vous ne pouvez pas suspendre votre propre compte administrateur');
    }
    user.accountStatus = status;
    if (status === UserAccountStatus.SUSPENDED) {
      user.isConnected = false;
    }
    await this.userRepo.save(user);
    return this.findOne(id);
  }

  private isValidSiretLuhn(siret: string): boolean 
  {
    if (!/^\d{14}$/.test(siret)) {
        return false;
    }
    let sum = 0;
    for (let i = 0; i < siret.length; i++) 
      {
        let digit = Number(siret[i]);
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
    }
    return sum % 10 === 0;
  }


  private async verifySiretExists(siret: string): Promise<boolean> 
  {
    try {
        const response = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(siret)}&per_page=10`);

        if (!response.ok) {
            throw new Error(`API entreprise indisponible : ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.results)) {
            return false;
        }
        return data.results.some((company: any) => {
            if (company.siege?.siret === siret) {
                return true;
            }
            if (Array.isArray(company.matching_etablissements) && company.matching_etablissements.some((establishment: any) => establishment.siret === siret)) {
                return true;
            }
            return false;
        });
    } catch (error) {
        console.error('Erreur vérification SIRET via API :', error);
        throw new ServiceUnavailableException('Le service de vérification des entreprises est temporairement indisponible');
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto) 
  {
    const userExists = await this.userRepo.findOneBy({email: createAdminDto.email});

    if (userExists) {
      throw new ConflictException('Un utilisateur avec cette adresse email existe déjà');
    }
    const admin = this.userRepo.create({
      firstName: createAdminDto.firstName,
      lastName: createAdminDto.lastName,
      email: createAdminDto.email,
      password: await this.hashString(createAdminDto.password),
      isConnected: false,
      role: UserRole.ADMIN,
      accountStatus: UserAccountStatus.ACTIVE,
      siret: null,
    });
    const savedAdmin = await this.userRepo.save(admin);
    return this.findOne(savedAdmin.id);
  }
  
}
