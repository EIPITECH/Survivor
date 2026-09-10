import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ForbiddenException } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiCreatedResponse, ApiOkResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserRole } from '../enum/user-role.enum';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({summary: "Postuler à une offre d'emploi (candidat uniquement)"})
  @ApiCreatedResponse({ description: 'Candidature créée' })
  @ApiForbiddenResponse({ description: "Réservé aux demandeurs d'emploi" })
  create(@Request() req: any, @Body() createApplicationDto: CreateApplicationDto) 
  {
    if (req.user.role !== UserRole.SEEKER) {
        throw new ForbiddenException('Seul un demandeur d\'emploi peut candidater');
    }
    return this.applicationService.create(req.user.userId, createApplicationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({summary: "Récupère les candidatures du candidat connecté"})
  @ApiOkResponse({ description: 'Liste des candidatures du candidat connecté' })
  @ApiForbiddenResponse({ description: "Réservé aux demandeurs d'emploi" })
  findMine(@Request() req: any) 
  {
    if (req.user.role !== UserRole.SEEKER) {
      throw new ForbiddenException('Seul un demandeur d\'emploi peut consulter ses candidatures');
    }
    return this.applicationService.findByUserId(req.user.userId);
  }

  @Get('employer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({summary: "Récupère les candidatures reçues par l'employeur connecté"})
  @ApiOkResponse({ description: 'Liste des candidatures reçues' })
  @ApiForbiddenResponse({ description: 'Réservé aux employeurs' })
  findForEmployer(@Request() req:any) 
  {
    if (req.user.role !== UserRole.EMPLOYER && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Seul un employeur peut consulter les candidatures reçues');
    }
    return this.applicationService.findByEmployerId(req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({summary: "Modifie le statut d'une candidature (employeur ou admin)"})
  @ApiParam({ name: 'id', description: 'ID de la candidature', example: 1 })
  @ApiOkResponse({ description: 'Statut de la candidature mis à jour' })
  @ApiForbiddenResponse({ description: 'Réservé aux employeurs' })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Request() req: any, @Body() updateApplicationDto: UpdateApplicationDto) 
  {
    if (req.user.role !== UserRole.EMPLOYER && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Seul un employeur peut modifier le statut d\'une candidature');
    }

    return this.applicationService.updateStatus(id, req.user.userId, updateApplicationDto);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({summary: "Récupère toutes les candidatures (administrateur uniquement)"})
  @ApiOkResponse({ description: 'Liste de toutes les candidatures' })
  @ApiForbiddenResponse({ description: 'Accès réservé aux administrateurs' })
  findAllForAdmin(@Request() req: any) 
  {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return this.applicationService.findAllForAdmin();
  }

}
