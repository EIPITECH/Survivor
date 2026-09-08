import {Body, Controller, Get, Post, Request, UseGuards} from '@nestjs/common';

import {ApiBearerAuth, ApiOperation} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ConsentsService } from './consent.service';
import { CreateConsentDto } from './dto/create-consent.dto';

@Controller('consents')
export class ConsentsController {
  constructor(
    private readonly consentsService: ConsentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('geolocation')
  @ApiOperation({summary: 'Enregistre une décision de consentement à la géolocalisation'})
  createGeolocationConsent(@Request() req: any, @Body() dto: CreateConsentDto) 
  {
    return this.consentsService.createGeolocationConsent(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({summary: 'Récupère les traces de consentement de l’utilisateur connecté'})
  findMine(@Request() req: any) 
  {
    return this.consentsService.findByUserId(req.user.userId);
  }
}
