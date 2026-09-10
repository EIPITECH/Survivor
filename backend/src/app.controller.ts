import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Point d'entrée racine de l'API (sanity check)" })
  @ApiOkResponse({ description: 'API disponible', type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}