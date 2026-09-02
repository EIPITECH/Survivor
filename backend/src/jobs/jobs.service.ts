import { Injectable,BadRequestException } from '@nestjs/common';
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
    
    const adressUrl = `${createJobDto.streetNumber} ${createJobDto.streetName} ${createJobDto.zipCode} ${createJobDto.cityName}`;
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adressUrl)}&limit=1`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Communication avec l'API de géocodage impossible");
      }
      const data = await response.json();
      if (!data.features || data.features.length === 0) {
        throw new BadRequestException("Impossible de géocoder l'adresse donnée");
      }
      const features = data.features[0];
      const longitude = features.geometry.coordinates[0];
      const latitude = features.geometry.coordinates[1];
      const score = features.properties.score;
      
      const newJob = new Job();
      newJob.title = createJobDto.title;
      newJob.employerId = createJobDto.employerId;
      newJob.description = createJobDto.description;
      newJob.cityName = createJobDto.cityName;
      newJob.streetNumber = createJobDto.streetNumber;
      newJob.streetName = createJobDto.streetName;
      newJob.zipCode = createJobDto.zipCode;
      newJob.latitude = latitude;
      newJob.geocodageSource = 'api-adresse.data.gouv.fr';
      newJob.longitude = longitude;
      newJob.trustScore = score;
      newJob.obtentionDate = new Date();

      return await this.jobRepo.save(newJob);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new BadRequestException(`Échec du géocodage : ${errorMessage}`)
    } 
  }

  async findAll() {
    return this.jobRepo.find()
  }
  
  async update(id: number, updateJobDto: UpdateJobDto) {
    return this.jobRepo.update({ id }, updateJobDto);
  }
}
