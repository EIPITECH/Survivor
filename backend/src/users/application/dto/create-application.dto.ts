import { IsOptional, IsString, MaxLength, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
    @Type(() => Number)
    @IsInt()
    @ApiProperty({
        description: "ID de l'offre d'emploi visée",
        example: 42,
    })
    jobId: number;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    @ApiPropertyOptional({
        description: 'Message de motivation (1000 caractères max)',
        example: 'Je suis très intéressé(e) par ce poste et disponible immédiatement.',
        maxLength: 1000,
    })
    message?: string;
}
