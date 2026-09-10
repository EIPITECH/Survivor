import {Body, Controller, Get, Post, Request, UseGuards} from '@nestjs/common';

import {ApiBearerAuth, ApiOperation, ApiTags, ApiCreatedResponse, ApiOkResponse} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ConsentsService } from './consent.service';
import { CreateConsentDto } from './dto/create-consent.dto';

@ApiTags('consents')
@Controller('consents')
export class ConsentsController {
  constructor(
    private readonly consentsService: ConsentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('geolocation')
  @ApiOperation({summary: 'Enregistre une décision de consentement à la géolocalisation'})
  @ApiCreatedResponse({ description: 'Décision de consentement enregistrée' })
  createGeolocationConsent(@Request() req: any, @Body() dto: CreateConsentDto) 
  {
    return this.consentsService.createGeolocationConsent(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({summary: 'Récupère les traces de consentement de l\'utilisateur connecté'})
  @ApiOkResponse({ description: 'Liste des traces de consentement' })
  findMine(@Request() req: any) 
  {
    return this.consentsService.findByUserId(req.user.userId);
  }
}
