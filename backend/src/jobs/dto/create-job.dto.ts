import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { jobStatus } from '../enum/jobs-status.enum';

export class CreateJobDto {
    @IsNotEmpty() 
    @IsString()
    @ApiProperty({
        description: 'Job\'s title',
        example: 'FullStack Developer',
    })
    title: string;

    @IsNotEmpty() 
    @IsString()
    @ApiProperty({
        description: 'Job\'s description',
        example: 'Your role is to create a web app which can do a lot of things',
    })
    description: string;

    @IsNotEmpty() 
    @IsNumber()
    @ApiProperty({
        description: 'Job\'s latitude coordinates',
        example: 48.8566,
    })
    latitude: number;

    @IsNotEmpty() 
    @IsNumber()
    @ApiProperty({
        description: 'Job\'s longitude coordinates',
        example: 2.3522,
    })
    longitude: number;

    @IsNotEmpty() 
    @IsNumber()
    @ApiProperty({
        description: 'Employer\'s Id who created the job',
        example: 123,
    })
    employerId: number;

    @IsOptional()
    @IsEnum(jobStatus)
    @ApiPropertyOptional({
        description: 'Job\'s status',
        enum: jobStatus,
        example: 'ACTIVE',
    })
    status?: jobStatus;
}
