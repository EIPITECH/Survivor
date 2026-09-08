import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { SeekersModule } from './seekers/seekers.module';
import { ApplicationModule } from './application/application.module';
import { Job } from '../jobs/entities/job.entity';
import { ConsentsModule } from './consent/consent.module';
import { Seeker } from './seekers/entities/seeker.entity';
import { Application } from './application/entities/application.entity';
import { Consent } from './consent/entities/consent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Job, Seeker, Application, Consent]), PassportModule.register({ session: false }), SeekersModule, ApplicationModule, ConsentsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
