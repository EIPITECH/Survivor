import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  isConnected: boolean;

  @Column()
  skills: string[];

  @Column()
  experience: [string, number];
  
  @Column()
  availability: boolean;
  
  @CreateDateColumn()
  createdAt: Date;
}
