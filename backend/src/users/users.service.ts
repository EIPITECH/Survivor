import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Job } from '../jobs/entities/job.entity';
import { UserRole } from './enum/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
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
}