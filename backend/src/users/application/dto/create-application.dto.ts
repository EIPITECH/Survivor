import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateApplicationDto {
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    message?: string;
}
