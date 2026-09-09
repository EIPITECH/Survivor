import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne} from 'typeorm';
import {IsEmail, IsString, IsNotEmpty, IsNumber, IsBoolean, IsDate, IsEnum} from 'class-validator'; 
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enum/user-role.enum';
import { Seeker } from '../seekers/entities/seeker.entity'
import { UserAccountStatus } from '../enum/user-account-status.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @IsNotEmpty() @IsNumber()
  @ApiProperty({
      description: 'User identification number',
      example: '1638256322864',
  })
  id: number;

  @Column()
  @IsNotEmpty() @IsString()
  @ApiProperty({
      description: 'User first name',
      example: 'Jane',
  })
  firstName: string;

  @Column()
  @IsNotEmpty() @IsString()
  @ApiProperty({
      description: 'User last name',
      example: 'Doe',
  })
  lastName: string;

  @Column({ unique: true })
  @IsNotEmpty() @IsEmail({}, {message: 'Email invalide'})
  @ApiProperty({
      description: 'User email address',
      example: 'jane.doe@domain.org',
  })
  email: string;

  @Column()
  @IsNotEmpty() @IsString()
  @ApiProperty({
      description: 'User hashed password',
      example: '$2a$05$LhayLxezLhK1LhWvKxCyLOj0j1u.Kj0jZ0pEmm134uzrQlFvQJLF6',
  })
  password: string;

  @Column()
  @IsNotEmpty() @IsBoolean()
  @ApiProperty({
      description: 'User online status',
      example: 'true',
  })
  isConnected: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SEEKER,
  })
  @IsNotEmpty() @IsEnum(UserRole)
  @ApiProperty({
      description: 'User role in the application',
      example: 'employer',
  })
  role: UserRole;

  @Column({type: 'enum', enum: UserAccountStatus, default: UserAccountStatus.ACTIVE})
  @IsNotEmpty()
  @IsEnum(UserAccountStatus)
  @ApiProperty({
    description: 'User account status',
    enum: UserAccountStatus,
    example: UserAccountStatus.ACTIVE,
  })
  accountStatus: UserAccountStatus;

  @OneToOne(() => Seeker, (seeker) => seeker.user)
  seeker?: Seeker;

  @Column({
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'SIRET de l’établissement pour un compte employeur',
    example: '55210055400013',
  })
  siret: string | null;

  @CreateDateColumn()
  @IsNotEmpty() @IsDate()
  @ApiProperty({
      description: 'User date of registration',
      example: '2025-09-03T14:20:00.000Z',
  })
  createdAt: Date;
}
