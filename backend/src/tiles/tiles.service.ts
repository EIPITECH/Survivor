import {
  Injectable,
  Logger,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class TilesService {
  private readonly logger = new Logger(TilesService.name);
  private readonly cacheDir: string;

  // fixed WMTS req parameters for PLAN IGN V2
  private readonly wmtsBaseUrl =
    'https://data.geopf.fr/wmts?' +
    'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0' +
    '&TILEMATRIXSET=PM&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2' +
    '&STYLE=normal&FORMAT=image/png';

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.cacheDir =
      this.config.get<string>('tiles.cacheDir') ?? '/data/wmts-cache';
  }

  private tilePath(z: string, x: string, y: string): string {
    if (![z, x, y].every((v) => /^\d+$/.test(v))) {
      throw new BadRequestException('Tile coordinates must be integers');
    }
    return path.join(this.cacheDir, `${z}_${x}_${y}.png`);
  }
  
  // Builds the tile's associated file in cache
  async getTile(z: string, x: string, y: string): Promise<Buffer> {
    const filePath = this.tilePath(z, x, y);

    try { return await fs.readFile(filePath); }
    catch { /* not cached! fetch the data */ }

    const url = `${this.wmtsBaseUrl}&TILEMATRIX=${z}&TILECOL=${x}&TILEROW=${y}`;

    let buffer: Buffer;
    try {
      const response = await firstValueFrom(
        this.http.get(url, { responseType: 'arraybuffer' }),
      );
      buffer = Buffer.from(response.data as ArrayBuffer);
    } catch (err) {
      this.logger.error(`Failed to fetch tile ${z}/${x}/${y} from IGN`, err);
      throw new BadGatewayException('Unable to reach the IGN tile service');
    }

    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, buffer);
      this.logger.debug(`Cached tile at ${filePath}`);
    } catch (err) {
      // maybe more precise errors? meh it's just a cache
      this.logger.warn(`Could not write tile ${z}/${x}/${y} to cache`, err);
    }

    return buffer;
  }
}
