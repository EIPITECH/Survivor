import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepo: Repository<Report>,

    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) {}

  async create(createReportDto: CreateReportDto) 
  {
    const job = await this.jobRepo.findOne({
      where: {
        id: createReportDto.jobId,
      },
    });

    if (!job) {
      throw new NotFoundException("Offre d'emploi non trouvée");
    }
    const report = this.reportRepo.create({reason: createReportDto.reason, message: createReportDto.message, job});
    return this.reportRepo.save(report);
  }

  findAll() {
    return this.reportRepo.find({
      relations: {
        job: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateStatus(reportId: number, updateReportStatusDto: UpdateReportStatusDto) 
  {
    const report = await this.reportRepo.findOne({
      where: {
        id: reportId,
      },
      relations: {
        job: true,
      },
    });

    if (!report) {
      throw new NotFoundException('Signalement introuvable');
    }
    report.status = updateReportStatusDto.status;
    return this.reportRepo.save(report);
  }
}
