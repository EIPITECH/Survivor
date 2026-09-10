import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*'
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 3000;

  const config = new DocumentBuilder()
    .setTitle('GéoEmploi')
    .setDescription('GéoEmploi\'s API')
    .setVersion('1.0')
    .addTag('auth', 'Connexion et authentification')
    .addTag('users', 'Gestion des comptes utilisateurs')
    .addTag('seekers', 'Profils candidats')
    .addTag('applications', "Candidatures aux offres d'emploi")
    .addTag('jobs', "Offres d'emploi")
    .addTag('reports', "Signalements d'offres")
    .addTag('notifications', 'Notifications utilisateur')
    .addTag('consents', 'Consentements RGPD')
    .addTag('tiles', 'Tuiles cartographiques')
    .addTag('health', "Vérification de l'état de l'API")
    .addTag('app', 'Racine de l\'API')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter your accessToken here',
      in: 'header',
    }, 'accessToken', // this name here is important for matching up with @ApiBearerAuth() decorator
    ).build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    }),
  );

  await app.listen(port);
}
bootstrap();
