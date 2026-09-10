import { Type } from 'class-transformer';
import {IsEnum, IsInt, IsOptional, IsString, MaxLength} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportReason } from '../enum/report-reason.enum';

export class CreateReportDto 
{
  @Type(() => Number)
  @IsInt()
  @ApiProperty({
    description: "ID de l'offre d'emploi signalée",
    example: 42,
  })
  jobId: number;

  @IsEnum(ReportReason)
  @ApiProperty({
    description: 'Motif du signalement',
    enum: ReportReason,
    example: ReportReason.FRAUD,
  })
  reason: ReportReason;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ApiPropertyOptional({
    description: 'Détails complémentaires sur le signalement (1000 caractères max)',
    example: "Cette offre demande un paiement avant l'entretien.",
    maxLength: 1000,
  })
  message?: string;
}
