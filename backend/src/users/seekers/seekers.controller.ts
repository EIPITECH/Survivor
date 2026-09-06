import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { SeekersService } from './seekers.service';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserRole } from '../enum/user-role.enum';

@Controller('seekers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
export class SeekersController {
  constructor(private readonly seekersService: SeekersService) {}

  @Post('me')
  createMe(@Request() req: any, @Body() createSeekerDto: CreateSeekerDto) 
  {
    if (req.user.role !== UserRole.SEEKER) {
      throw new ForbiddenException('Accès refusé vous n\'êtes pas candidat');
    }
    return this.seekersService.createForUser(req.user.userId, createSeekerDto);
  }

  @Get('me')
  findMe(@Request() req: any) {
    if (req.user.role !== UserRole.SEEKER) {
      throw new ForbiddenException('Accès refusé vous n\'êtes pas candidat');
    }
    return this.seekersService.findMe(req.user.userId);
  }

  @Patch('me')
  updateMe(@Request() req: any, @Body() updateSeekerDto: UpdateSeekerDto) 
  {
    if (req.user.role !== UserRole.SEEKER) {
      throw new ForbiddenException('Accès refusé vous n\'êtes pas candidat');
    }
    return this.seekersService.updateMe(req.user.userId, updateSeekerDto);
  }
}
