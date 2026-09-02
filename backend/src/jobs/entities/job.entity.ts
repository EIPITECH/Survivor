import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { jobStatus } from '../enum/jobs-status.enum';

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

    @Column()
    @IsNotEmpty() @IsString()
    cityName: string

    @Column()
    @IsNotEmpty() @IsNumber()
    streetNumber: number

    @Column()
    @IsNotEmpty() @IsString()
    streetName: string

    @Column()
    @IsNotEmpty() @IsNumber()
    zipCode: number

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
        default: jobStatus.TOCHECK,
    })
    status: jobStatus;

    @Column()
    @IsNotEmpty() @IsString()
    geocodageSource: string

    @Column({type: 'float'})
    @IsNotEmpty() @IsNumber()
    trustScore: number

    @Column()
    @IsNotEmpty() @IsDate()
    obtentionDate: Date

    @CreateDateColumn()
    @IsNotEmpty() @IsDate()
    createdAt: Date;
}
