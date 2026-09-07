import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { SeekersModule } from './seekers/seekers.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule.register({ session: false }), SeekersModule, ApplicationModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
