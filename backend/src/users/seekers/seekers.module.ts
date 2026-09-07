import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeekersService } from './seekers.service';
import { SeekersController } from './seekers.controller';
import { Seeker } from './entities/seeker.entity';
import { User } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { AppController } from '../../app.controller';
import { Application } from '../application/entities/application.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([Seeker, User, Application]),
    PassportModule.register({session: false}),
  ],
  controllers: [SeekersController],
  providers: [SeekersService],
})
export class SeekersModule {}
  