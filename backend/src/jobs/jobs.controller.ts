import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException} from '@nestjs/common';
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
      throw new ForbiddenException("Vous devez être un employeur pour publier une offre");
    }
    return this.jobsService.create(createJobDto, req.user.userId);
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

  @Get('active/grouped')
  @ApiOperation({
    summary: 'Récupère les offres actives regroupées par commune'
  })
  findAllActiveGrouped() 
  {
    return this.jobsService.findAllActiveGrouped();
  }
  
  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({summary: 'Récupère les offres publiées par l’employeur connecté'})
  findMine(@Request() req: any) 
  {
    if (req.user.role !== UserRole.EMPLOYER && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Vous devez être un employeur pour récupérer vos offres');
    }
    return this.jobsService.findMine(req.user.userId);
  }

  @Post(':id/view')
  @ApiOperation({summary: 'Incrémente le nombre de vues d’une offre'})
  incrementViews(@Param('id') id: string)
  {
    return this.jobsService.incrementViews(Number(id));
  }
}

