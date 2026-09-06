import { Injectable,   NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeker } from './entities/seeker.entity';
import { User } from '../entities/user.entity';
import { UserRole } from '../enum/user-role.enum';

@Injectable()
export class SeekersService {
  constructor(
    @InjectRepository(Seeker)
    private seekerRepo: Repository<Seeker>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

    async createForUser(userId: number, createSeekerDto: CreateSeekerDto) {
      const user = await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur introuvable');
      }

      if (user.role !== UserRole.SEEKER) {
        throw new ForbiddenException('Seuls les candidats peuvent créer un profil candidat');
      }
      const existingSeeker = await this.seekerRepo.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });

      if (existingSeeker) {
        throw new ConflictException(
          'Un profil candidat existe déjà pour cet utilisateur');
      }

      const seeker = this.seekerRepo.create({
        skills: createSeekerDto.skills,
        experience: createSeekerDto.experience,
        availability: createSeekerDto.availability,
        user: user,
      });

      return this.seekerRepo.save(seeker);
    }

  async findMe(userId: number) {
    const seeker = await this.seekerRepo.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!seeker) {
      throw new NotFoundException('Profil candidat introuvable');
    }

    return seeker;
  }

  async updateMe(
    userId: number,
    updateSeekerDto: UpdateSeekerDto,
  ) {
    const seeker = await this.seekerRepo.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!seeker) {
      throw new NotFoundException('Profil candidat introuvable');
    }

    Object.assign(seeker, updateSeekerDto);

    return this.seekerRepo.save(seeker);
  }
}
