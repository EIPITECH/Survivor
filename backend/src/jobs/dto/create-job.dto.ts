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
        description: 'Street\'s number',
        example: 123
    })
    streetNumber: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Street\'s name',
        example: 'Rue beau chatêau'
    })
    streetName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'City\'s name',
        example: 'Paris'
    })
    cityName: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: 'Zip code',
        example: 75000
    })
    zipCode: number;

    @IsNotEmpty() 
    @IsNumber()
    @IsOptional()
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
