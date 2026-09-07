import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Seeker } from '../seekers/entities/seeker.entity'
import { Job } from '../../jobs/entities/job.entity'
import { PassportModule } from '@nestjs/passport';
@Module({

  imports: [
        TypeOrmModule.forFeature([
            Application,
            Seeker,
            Job,
        ]),PassportModule.register({ session: false })],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
