import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../enum/application-status.enum';

export class UpdateApplicationDto {
    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;
}
