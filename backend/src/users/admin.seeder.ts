import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './enum/user-role.enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource) {

    const userRepository = dataSource.getRepository(User);
    const adminEmail = 'admin@job-et-bonheur.fr';
    const adminExists = await userRepository.findOneBy({ email: 'admin@job-et-bonheur.fr' });

    if (!adminExists) {
      console.log("Création du compte administrateur");
      const rawPassword = crypto.randomBytes(6).toString('hex');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

      await userRepository.save({
        firstName: 'Admin',
        lastName: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        isConnected: false,
        role: UserRole.ADMIN,
      });
      console.log('Compte administrateur crée avec succès\nMot de passe:', {rawPassword});

    } else {
      console.log('Le compte administrateur existe déjà');
    }
  }
}
