import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TilesController } from './tiles.controller';
import { TilesService } from './tiles.service';

@Module({
  imports: [HttpModule],
  controllers: [TilesController],
  providers: [TilesService],
})
export class TilesModule {}
