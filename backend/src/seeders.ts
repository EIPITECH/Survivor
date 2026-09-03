import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import AdminSeeder from './users/admin.seeder';

@Injectable()
export class AdminSeederService implements OnApplicationBootstrap 
{
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      const adminInjection = new AdminSeeder();
      adminInjection.run(this.dataSource);
      console.log("Compte admin crée avec succès");
    }
    catch(error) {
      console.log("Impossible de créer le compte admin : ", error);
    }
  }
}
