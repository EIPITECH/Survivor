import { IsDataURI, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { jobStatus } from '../enum/jobs-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


@Entity()
export class Job 
{
    @PrimaryGeneratedColumn()
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
        description: 'Job\'s identification number',
        example: '13',
    })
    id: number

    @Column()
    @IsNotEmpty() @IsString()
    @ApiProperty({
      description: 'Job\'s title',
      example: 'FullStack Developer',
    })
    title: string

    @Column()
    @IsNotEmpty() @IsString()
    @ApiProperty({
      description: 'Job\'s description',
      example: 'Your role is to create a web app which can do a lot of things',
    })
    description: string

    @Column()
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
      description: 'Job\'s latitude coordinates',
      example: '48,8566',
    })
    latitude: number

    @Column()
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
      description: 'Job\'s longitude coordinates',
      example: '123,8231',
    })
    longitude: number

    @Column()
    @IsNotEmpty() @IsNumber()
    @ApiProperty({
      description: 'employer\'s Id who created the job',
      example: '123',
    })
    employerId: number

    @Column({
        type: 'enum',
        enum: jobStatus,
        default: jobStatus.ACTIVE,
    })
    @ApiProperty({
      description: 'Job\'s status',
      example: 'active',
    })
    status: jobStatus;

    @CreateDateColumn()
    @IsNotEmpty() @IsDate()
      @ApiProperty({
      description: 'Job\'s date of registration (Unix timestamp)',
      example: '1788247691',
    })
    createdAt: Date;
}
