import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus } from '../enum/report-status.enum';

export class UpdateReportStatusDto
{
  @IsEnum(ReportStatus)
  @ApiProperty({
    description: 'Nouveau statut du signalement',
    enum: ReportStatus,
    example: ReportStatus.RESOLVED,
  })
  status: ReportStatus;
}
