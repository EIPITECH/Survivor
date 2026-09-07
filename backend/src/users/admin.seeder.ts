import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../users/entities/user.entity';
import { UserRole } from './enum/user-role.enum';

export default class AdminSeeder implements Seeder {
  async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const adminEmail = 'admin@job-et-bonheur.fr';
    const adminExists = await userRepository.findOneBy({ email: adminEmail });

    if (!adminExists) {
      console.log('Création du compte administrateur');

      const rawPassword = crypto.randomBytes(6).toString('hex');
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      await userRepository.save({
        firstName: 'Admin',
        lastName: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        isConnected: false,
        role: UserRole.ADMIN,
      });

      console.log('Compte administrateur créé avec succès\nMot de passe:', rawPassword);
    } else {
      console.log('Le compte administrateur existe déjà');
    }
  }
}
