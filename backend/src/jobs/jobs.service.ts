import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto) {
    const newJob = this.jobRepo.create(createJobDto);
    return await this.jobRepo.save(newJob);
  }

  async findAll() {
    return this.jobRepo.find()
  }
  
}
