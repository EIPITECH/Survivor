import {Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam, ApiCreatedResponse, ApiOkResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../users/enum/user-role.enum';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({summary: "Signaler une offre d'emploi frauduleuse ou non conforme (candidat uniquement)"})
  @ApiCreatedResponse({ description: 'Signalement créé' })
  @ApiForbiddenResponse({ description: "Réservé aux demandeurs d'emploi" })
  create(@Body() createReportDto: CreateReportDto, @Request() req: any) 
  {
    if (req.user.role !== UserRole.SEEKER) {
      throw new ForbiddenException('Vous devez être un demandeur d\'emploi pour signaler une offre');
    }
    
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Récupérer tous les signalements (admin)'})
  @ApiOkResponse({ description: 'Liste des signalements' })
  @ApiForbiddenResponse({ description: 'Accès réservé aux administrateurs' })
  findAll(@Request() req: any) 
  {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return this.reportsService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: "Modifier le statut d'un signalement (admin)"})
  @ApiParam({ name: 'id', description: 'ID du signalement', example: 1 })
  @ApiOkResponse({ description: 'Statut du signalement mis à jour' })
  @ApiForbiddenResponse({ description: 'Accès réservé aux administrateurs' })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateReportStatusDto: UpdateReportStatusDto, @Request() req: any) 
  {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return this.reportsService.updateStatus(id, updateReportStatusDto);
  }
}
