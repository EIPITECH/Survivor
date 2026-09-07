import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, ManyToOne, Unique } from 'typeorm';
import {IsEmail, IsString, IsNotEmpty, IsNumber, IsBoolean, IsDate, IsEnum, isMongoId, IsOptional, MaxLength} from 'class-validator'; 
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../entities/user.entity'
import { Job } from '../../../jobs/entities/job.entity';
import { Seeker } from '../../seekers/entities/seeker.entity';
import { ApplicationStatus } from '../enum/application-status.enum';

@Entity()
@Unique(['seeker', 'job'])
export class Application {
    @PrimaryGeneratedColumn()
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
        description: 'seeker identification number',
        example: '164',
    })
    id: number;

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.SUBMITTED,
    })
        status: ApplicationStatus;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(
    () => Seeker,
    (seeker) => seeker.applications,
    {
        nullable: false,
        onDelete: 'CASCADE',
    })
    seeker: Seeker;

    @ManyToOne(
    () => Job,
    (job) => job.applications,
    {
        nullable: false,
        onDelete: 'CASCADE',
    })
    job: Job;

    @Column()
    @IsString() @IsOptional()
    @MaxLength(1000)
    message: string
}
