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
