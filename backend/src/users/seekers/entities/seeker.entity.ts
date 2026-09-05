import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import {IsEmail, IsString, IsNotEmpty, IsNumber, IsBoolean, IsDate, IsEnum, isMongoId} from 'class-validator'; 
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../entities/user.entity'

@Entity()
export class Seeker {
  @PrimaryGeneratedColumn()
  @IsNotEmpty() @IsNumber()
  @ApiProperty({
      description: 'seeker identification number',
      example: '164',
  })
  id: number;

  @Column({nullable: true})
  @IsString()
  @ApiProperty({
      description: 'seeker\'s skills',
      example: 'DevOps',
  })
  skills: string;

  @Column({nullable: true})
  @IsString()
  @ApiProperty({
      description: 'seeker\'s experience',
      example: '2 years as an Frontend developper',
  })
  experience: string;

  @Column({nullable: true })
  @ApiProperty({
      description: 'seeker\'s availability',
      example: '12/02/2027 - 18/12/2027',
  })
  availability: string;

  @OneToOne(() => User, (user) => user.seeker, {
    nullable: false,
    onDelete: 'CASCADE',
  })

  @JoinColumn({ name: 'userId' })
  user: User;
}
