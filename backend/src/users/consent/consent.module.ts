import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Consent } from './entities/consent.entity';
import { User } from '../entities/user.entity';

import { ConsentsService } from './consent.service';
import { ConsentsController } from './consent.controller';

import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consent, User]), PassportModule.register({session: false}),
  ],
  controllers: [
    ConsentsController,
  ],
  providers: [
    ConsentsService,
  ],
  exports: [
    ConsentsService,
  ],
})
export class ConsentsModule {}
