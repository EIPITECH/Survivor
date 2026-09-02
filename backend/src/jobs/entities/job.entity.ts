import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { jobStatus } from '../enum/jobs-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


@Entity()
export class Job 
{
    @PrimaryGeneratedColumn()
    @IsNotEmpty() @IsNumber()
    id: number

    @Column()
    @IsNotEmpty() @IsString()
    title: string

    @Column()
    @IsNotEmpty() @IsString()

    description: string

    @Column({type: 'float'})
    @IsNotEmpty() @IsNumber()

    latitude: number

    @Column({type: 'float'})
    @IsNotEmpty() @IsNumber()

    longitude: number

    @Column()
    @IsNotEmpty() @IsNumber()

    employerId: number

    @Column({
        type: 'enum',
        enum: jobStatus,
        default: jobStatus.ACTIVE,
    })

    status: jobStatus;

    @CreateDateColumn()
    @IsNotEmpty() @IsDate()
    createdAt: Date;
}
