import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { SeekersService } from './seekers.service';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserRole } from '../enum/user-role.enum';

@ApiTags('seekers')
@Controller('seekers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
export class SeekersController {
  constructor(private readonly seekersService: SeekersService) {}

  @Post('me')
  @ApiOperation({summary: 'Crée le profil candidat de l\'utilisateur connecté'})
  @ApiCreatedResponse({ description: 'Profil candidat créé' })
  @ApiForbiddenResponse({ description: "Réservé aux comptes candidats" })
  createMe(@Request() req: any, @Body() createSeekerDto: CreateSeekerDto) 
  {
    if (req.user.role !== UserRole.SEEKER) {
      throw new ForbiddenException('Accès refusé vous n\'êtes pas candidat');
    }
    return this.seekersService.createForUser(req.user.userId, createSeekerDto);
  }

  @Get('me')
  @ApiOperation({summary: 'Récupère le profil candidat de l\'utilisateur connecté'})
  @ApiOkResponse({ description: 'Profil candidat trouvé' })
  @ApiForbiddenResponse({ description: "Réservé aux comptes candidats" })
  findMe(@Request() req: any) {
    if (req.user.role !== UserRole.SEEKER) {
      throw new ForbiddenException('Accès refusé vous n\'êtes pas candidat');
    }
    return this.seekersService.findMe(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({summary: 'Met à jour le profil candidat de l\'utilisateur connecté'})
  @ApiOkResponse({ description: 'Profil candidat mis à jour' })
  @ApiForbiddenResponse({ description: "Réservé aux comptes candidats" })
  updateMe(@Request() req: any, @Body() updateSeekerDto: UpdateSeekerDto) 
  {
    if (req.user.role !== UserRole.SEEKER) {
      throw new ForbiddenException('Accès refusé vous n\'êtes pas candidat');
    }
    return this.seekersService.updateMe(req.user.userId, updateSeekerDto);
  }
}
