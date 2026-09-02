import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import {IsEmail, IsString, IsNotEmpty, IsNumber, IsBoolean, IsDate} from 'class-validator'; 
import { UserRole } from '../enum/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @IsNotEmpty() @IsNumber()
  id: number;

  @Column()
  @IsNotEmpty() @IsString()
  firstName: string;

  @Column()
  @IsNotEmpty() @IsString()

  lastName: string;

  @Column({ unique: true })
  @IsNotEmpty() @IsEmail({}, {message: 'Email invalide'})

  email: string;

  @Column()
  @IsNotEmpty() @IsString()
  password: string;

  @Column()
  @IsNotEmpty() @IsBoolean()
  isConnected: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SEEKER,
  })
  role: UserRole;

  @CreateDateColumn()
  @IsNotEmpty() @IsDate()
  createdAt: Date;
}
