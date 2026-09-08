import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserAccountStatus } from '../enum/user-account-status.enum';

export class UpdateUserStatusDto {
  @IsEnum(UserAccountStatus)
  @ApiProperty({
    enum: UserAccountStatus,
    example: UserAccountStatus.SUSPENDED,
  })
  status: UserAccountStatus;
}
