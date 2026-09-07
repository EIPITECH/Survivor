import { IsOptional, IsString, MaxLength, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApplicationDto {
    @Type(() => Number)
    @IsInt()
    jobId: number;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    message?: string;
}
