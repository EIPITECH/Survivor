import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import AdminSeeder from './users/admin.seeder';

async function bootstrap() 
{
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    const seeder = new AdminSeeder();
    await seeder.run(dataSource);
  } catch (error) {
    console.error('Erreur lors du lancement :', error);
  } finally {
    await app.close();
  }
}
bootstrap();
