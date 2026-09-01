import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  private async hashString(str: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(str, saltRounds);
  }

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.isConnected = false;
    user.password = await this.hashString(createUserDto.password);
    return this.userRepo.save(user);
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async remove(id: number) {
    return this.userRepo.delete({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update({ id }, updateUserDto);
  }
}