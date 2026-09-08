import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';
import { ReportReason } from '../enum/report-reason.enum';
import { ReportStatus } from '../enum/report-status.enum';

@Entity()
export class Report 
{
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
  })
  id: number;

  @Column({type: 'enum', enum: ReportReason})
  @ApiProperty({
    enum: ReportReason,
    example: ReportReason.FRAUD,
  })
  reason: ReportReason;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'Informations complémentaires sur le signalement',
    example: "L'entreprise demande un paiement avant l'entretien.",
  })
  message?: string | null;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  @ApiProperty({enum: ReportStatus, example: ReportStatus.PENDING})
  status: ReportStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => Job,
    (job) => job.reports,
    {
      nullable: false,
      onDelete: 'CASCADE',
    }
  )
  job: Job;
}
