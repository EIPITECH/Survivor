import { IsDate, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { jobStatus } from '../enum/jobs-status.enum';

@Entity()
export class Job 
{
    @PrimaryGeneratedColumn()
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
        description: 'Job identification number',
        example: '1638256322864',
    })
    id: number

    @Column()
    @IsNotEmpty() @IsString()
    @ApiProperty({
        description: 'Job title',
        example: 'Ingénieur(e) développement Go/Rust (H/F)',
    })
    title: string

    @Column()
    @IsNotEmpty() @IsString()
    @ApiProperty({
        description: 'Job description',
        example: `Développer, tester et exécuter le cycle de vie complet du développement logiciel. Concevoir, mettre en œuvre et tester des fonctionnalités en tenant compte de l'évolutivité, des performances, du déploiement/de l'exploitation et de l'expérience de l'utilisateur(ice) final(e)`
    })
    description: string

    @Column()
    @IsNotEmpty() @IsString()
    @ApiProperty({
        description: 'Name of the city where the job is located',
        example: 'Saint-Jacques-de-la-Lande',
    })
    cityName: string

    @Column()
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
        description: 'Street number of the job location',
        example: 1,
    })
    streetNumber: number

    @Column()
    @IsNotEmpty() @IsString()
    @ApiProperty({
        description: 'Street name of the job location',
        example: 'Rue Louis Braille',
    })
    streetName: string

    @Column()
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
        description: 'Zip code of the job location',
        example: 35136,
    })
    zipCode: number

    @Column({type: 'float'})
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
        description: 'Latitude coordinate of the job location',
        example: 48.1165312 ,
    })
    latitude: number

    @Column({type: 'float'})
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
        description: 'Longitude coordinate of the job location',
        example: -1.7072128,
    })
    longitude: number

    @Column()
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
        description: 'Identification number of the employer who posted the job',
        example: 42,
    })
    employerId: number

    @Column({
        type: 'enum',
        enum: jobStatus,
        default: jobStatus.TOCHECK,
    })
        @ApiProperty({
        description: 'Job current status',
        example: jobStatus.ACTIVE,
    })
    status: jobStatus;

    @Column()
    @IsNotEmpty() @IsString()
    @ApiProperty({
        description: 'Source used to geocode the job address',
        example: 'google-maps-api',
    })
    geocodageSource: string

    @Column({type: 'float'})
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
        description: 'Trust score of the job data, between 0 and 1',
        default: 0.75,
        example: 0.92,
    })
    trustScore: number

    @Column()
    @IsDate() @ApiProperty({
        description: 'Date the job was obtained/confirmed',
        example: '2025-06-15T10:30:00.000Z',
    })
    obtentionDate: Date

    @CreateDateColumn()
    @IsNotEmpty() @IsDate()
    @ApiProperty({
        description: 'Job date of registration',
        example: '2025-09-03T14:20:00.000Z',
    })
    createdAt: Date;
}
