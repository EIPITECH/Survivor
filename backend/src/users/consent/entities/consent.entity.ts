import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

@Entity()
export class Consent {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
  })
  id: number;

  @Column({
    type: 'varchar',
  })
  @ApiProperty({
    example: 'geolocation',
  })
  type: string;

  @Column({
    type: 'boolean',
  })
  @ApiProperty({
    example: true,
  })
  granted: boolean;

  @Column({
    type: 'varchar',
  })
  @ApiProperty({
    example: '1.0',
  })
  noticeVersion: string;

  @CreateDateColumn()
  @ApiProperty({
    example: '2026-09-08T01:30:00.000Z',
  })
  createdAt: Date;

  @ManyToOne(
    () => User,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'userId',
  })
  user: User;
}
