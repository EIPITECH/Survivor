import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ForbiddenException } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserRole } from '../enum/user-role.enum';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() createApplicationDto: CreateApplicationDto) 
  {
    if (req.user.role !== UserRole.SEEKER) {
        throw new ForbiddenException('Seul un demandeur d’emploi peut candidater');
    }
    return this.applicationService.create(req.user.userId, createApplicationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findMine(@Request() req: any) 
  {
    if (req.user.role !== UserRole.SEEKER) {
      throw new ForbiddenException('Seul un demandeur d’emploi peut consulter ses candidatures');
    }
    return this.applicationService.findByUserId(req.user.userId);
  }

  @Get('employer')
  @UseGuards(JwtAuthGuard)
  findForEmployer(@Request() req:any) 
  {
    if (req.user.role !== UserRole.EMPLOYER && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Seul un employeur peut consulter les candidatures reçues');
    }
    return this.applicationService.findByEmployerId(req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id', ParseIntPipe) id: number, @Request() req: any, @Body() updateApplicationDto: UpdateApplicationDto) 
  {
    if (req.user.role !== UserRole.EMPLOYER && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Seul un employeur peut modifier le statut d’une candidature');
    }

    return this.applicationService.updateStatus(id, req.user.userId, updateApplicationDto);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  findAllForAdmin(@Request() req: any) 
  {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return this.applicationService.findAllForAdmin();
  }

}
