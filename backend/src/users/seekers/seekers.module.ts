import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeekersService } from './seekers.service';
import { SeekersController } from './seekers.controller';
import { Seeker } from './entities/seeker.entity';
import { User } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
   imports: [
    TypeOrmModule.forFeature([Seeker, User]),
    PassportModule.register({session: false}),
  ],
  controllers: [SeekersController],
  providers: [SeekersService],
})
export class SeekersModule {}
  