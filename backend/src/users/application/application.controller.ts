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
      return this.applicationService.findByUserId(req.user.userId);
  }
}
