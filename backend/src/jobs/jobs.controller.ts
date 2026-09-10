import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam, ApiCreatedResponse, ApiOkResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { UserRole } from '../users/enum/user-role.enum';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(JwtAuthGuard) @ApiBearerAuth('accessToken')
  @Post()
  @ApiOperation({summary: 'Créer un nouvelle offre de job (authentification requise)'})
  @ApiCreatedResponse({ description: 'Offre créée' })
  @ApiForbiddenResponse({ description: 'Réservé aux employeurs' })
  create(@Body() createJobDto: CreateJobDto, @Request() req: any) {
    if (req.user.role !== UserRole.EMPLOYER && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Vous devez être un employeur pour publier une offre");
    }
    return this.jobsService.create(createJobDto, req.user.userId);
  }

  @Get()
  @ApiOperation({summary: 'Récupère toutes les offres de job (authentification non requise'})
  @ApiOkResponse({ description: 'Liste de toutes les offres' })
  findAll() {
    return this.jobsService.findAll();
  }

  @Get('active')
  @ApiOperation({summary: 'Récupère toutes les offres de job actives (authentification non requise'})
  @ApiOkResponse({ description: 'Liste des offres actives' })
  findAllActive() {
    return this.jobsService.findAllActive();
  }

  @Get('active/grouped')
  @ApiOperation({
    summary: 'Récupère les offres actives regroupées par commune'
  })
  @ApiOkResponse({ description: 'Offres actives regroupées par commune' })
  findAllActiveGrouped() 
  {
    return this.jobsService.findAllActiveGrouped();
  }
  
  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({summary: 'Récupère les offres publiées par l\'employeur connecté'})
  @ApiOkResponse({ description: "Liste des offres de l'employeur connecté" })
  @ApiForbiddenResponse({ description: 'Réservé aux employeurs' })
  findMine(@Request() req: any) 
  {
    if (req.user.role !== UserRole.EMPLOYER && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Vous devez être un employeur pour récupérer vos offres');
    }
    return this.jobsService.findMine(req.user.userId);
  }

  @Post(':id/view')
  @ApiOperation({summary: 'Incrémente le nombre de vues d\'une offre'})
  @ApiParam({ name: 'id', description: "ID de l'offre", example: 1 })
  @ApiOkResponse({ description: 'Compteur de vues incrémenté' })
  incrementViews(@Param('id') id: string)
  {
    return this.jobsService.incrementViews(Number(id));
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: "Modifier le statut d'une offre (administrateur uniquement)",
  })
  @ApiParam({ name: 'id', description: "ID de l'offre", example: 1 })
  @ApiOkResponse({ description: "Statut de l'offre mis à jour" })
  @ApiForbiddenResponse({ description: 'Accès réservé aux administrateurs' })
  updateStatus(@Param('id') id: string, @Body('status') status: jobStatus, @Request() req: any) 
  {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }

    if (!Object.values(jobStatus).includes(status)) {
      throw new BadRequestException('Statut invalide');
    }
    
    return this.jobsService.updateStatus(Number(id), status);
  }
}
