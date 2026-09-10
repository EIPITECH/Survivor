import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../enum/application-status.enum';

export class UpdateApplicationDto {
    @IsEnum(ApplicationStatus)
    @ApiProperty({
        description: "Nouveau statut de la candidature",
        enum: ApplicationStatus,
        example: ApplicationStatus.ACCEPTED,
    })
    status: ApplicationStatus;
}
