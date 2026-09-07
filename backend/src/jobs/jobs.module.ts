import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { AuthModule } from '../auth/auth.module';
import { Application } from '../users/application/entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Application]), AuthModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
