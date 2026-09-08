import { Type } from 'class-transformer';
import {IsEnum, IsInt, IsOptional, IsString, MaxLength} from 'class-validator';
import { ReportReason } from '../enum/report-reason.enum';

export class CreateReportDto 
{
  @Type(() => Number)
  @IsInt()
  jobId: number;

  @IsEnum(ReportReason)
  reason: ReportReason;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}