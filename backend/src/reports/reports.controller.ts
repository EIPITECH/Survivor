import {Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../users/enum/user-role.enum';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService
  ) {}

  @Post()
  @ApiOperation({summary: "Signaler une offre d'emploi frauduleuse ou non conforme"})
  create(@Body() createReportDto: CreateReportDto) 
  {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Récupérer tous les signalements (admin)'})
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
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateReportStatusDto: UpdateReportStatusDto, @Request() req: any) 
  {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return this.reportsService.updateStatus(id, updateReportStatusDto);
  }
}
