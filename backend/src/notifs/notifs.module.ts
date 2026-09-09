import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifsService } from './notifs.service';
import { NotifsController } from './notifs.controller';
import { Notifs } from './entities/notif.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
        TypeOrmModule.forFeature([
            Notifs,
        ]),
        PassportModule.register({ session: false }),
    ],
  controllers: [NotifsController],
  providers: [NotifsService],
})
export class NotifsModule {}
