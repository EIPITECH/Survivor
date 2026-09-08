import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { Job } from './jobs/entities/job.entity';
import { HealthModule } from './health/health.module';
import { TilesModule } from './tiles/tiles.module';
import configuration from './config/configuration';
import { SeekersModule } from './users/seekers/seekers.module';
import { Seeker } from './users/seekers/entities/seeker.entity';
import { ApplicationModule } from './users/application/application.module';
import { Application } from './users/application/entities/application.entity';
import { SeederService } from './seeders';
import { ScheduleModule } from '@nestjs/schedule';
import { Consent } from './users/consent/entities/consent.entity';
import { ConsentsModule } from './users/consent/consent.module';
import { ReportsModule } from './reports/reports.module';
import { Report } from './reports/entities/report.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration]
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [User, Job, Seeker, Application, Consent, Report],
        synchronize: configService.get<boolean>('database.dev_mode'),
      }),
    }),
    HealthModule,
    UsersModule,
    AuthModule,
    JobsModule,
    TilesModule,
    SeekersModule,
    ApplicationModule,
    ConsentsModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})

export class AppModule {}
