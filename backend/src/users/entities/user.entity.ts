import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import {IsEmail, IsString, IsNotEmpty, IsNumber, IsBoolean, IsDate} from 'class-validator'; 
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @IsNotEmpty() @IsNumber()
  @ApiProperty({
      description: 'User\'s identification number',
      example: '1638256322864',
  })
  id: number;

  @Column()
  @IsNotEmpty() @IsString()
  @ApiProperty({
      description: 'User\'s first name',
      example: 'Jane',
  })
  firstName: string;

  @Column()
  @IsNotEmpty() @IsString()
  @ApiProperty({
      description: 'User\'s last name',
      example: 'Doe',
  })
  lastName: string;

  @Column({ unique: true })
  @IsNotEmpty() @IsEmail({}, {message: 'Email invalide'})
  @ApiProperty({
      description: 'User\'s email address',
      example: 'jane.doe@domain.org',
  })
  email: string;

  @Column()
  @IsNotEmpty() @IsString()
  @ApiProperty({
      description: 'User\'s hashed password',
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

  @CreateDateColumn()
  @IsNotEmpty() @IsDate()
  @ApiProperty({
      description: 'User\'s date of registration (Unix timestamp)',
      example: '1788247691',
  })
  createdAt: Date;
}
