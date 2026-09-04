import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { jobStatus } from '../enum/jobs-status.enum';

export class CreateJobDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Job title',
        example: 'Ingénieur(e) développement Go/Rust (H/F)',
    })
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Job description',
        example: `Développer, tester et exécuter le cycle de vie complet du développement logiciel. Concevoir, mettre en œuvre et tester des fonctionnalités en tenant compte de l'évolutivité, des performances, du déploiement/de l'exploitation et de l'expérience de l'utilisateur(ice) final(e)`,
    })
    description: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Name of the city where the job is located',
        example: 'Saint-Jacques-de-la-Lande',
    })
    cityName: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: 'Street number of the job location',
        example: 1,
    })
    streetNumber: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Street name of the job location',
        example: 'Rue Louis Braille',
    })
    streetName: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: 'Zip code of the job location',
        example: 35136,
    })
    zipCode: number;

    @IsNotEmpty()
    @IsString() @ApiProperty({
        description: 'Company name',
        example: 'Nova Technologies',
    })
    companyName: string
}
