import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiOperation, ApiParam, ApiProduces } from '@nestjs/swagger';
import { TilesService } from './tiles.service';

@Controller('tiles')
export class TilesController {
  constructor(private readonly tilesService: TilesService) {}

  @Get(':z/:x/:y')
  @ApiOperation({
    summary:
      "Renvoie une tuile de données cartographiques en format PNG",
  })
  @ApiParam({ name: 'z', description: 'TILEMATRIX (zoom level)' })
  @ApiParam({ name: 'x', description: 'TILECOL' })
  @ApiParam({ name: 'y', description: 'TILEROW' })
  @ApiProduces('image/png')
  async getTile(
    @Param('z') z: string,
    @Param('x') x: string,
    @Param('y') y: string,
    @Res() res: Response,
  ) {
    const tile = await this.tilesService.getTile(z, x, y);
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=604800, immutable');
    res.send(tile);
  }
}
