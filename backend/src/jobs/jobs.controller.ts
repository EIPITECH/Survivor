import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request,UnauthorizedException} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '../users/enum/user-role.enum';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(JwtAuthGuard) @ApiBearerAuth('accessToken')
  @Post()
  @ApiOperation({summary: 'Créer un nouvelle offre de job (authentification requise)'})
  create(@Body() createJobDto: CreateJobDto, @Request() req: any) {
    if (req.user.role !== UserRole.EMPLOYER && req.user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException("Vous devez être un employeur pour publier une offre");
    }
    createJobDto.employerId = req.user.userId;
    return this.jobsService.create(createJobDto);
  }

  @Get()
  @ApiOperation({summary: 'Récupère toutes les offres de job (authentification non requise'})
  findAll() {
    return this.jobsService.findAll();
  }

  @Get('active')
  @ApiOperation({summary: 'Récupère toutes les offres de job actives (authentification non requise'})
  findAllActive() {
    return this.jobsService.findAllActive();
  }
}
