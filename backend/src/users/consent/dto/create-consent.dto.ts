import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConsentDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user granted geolocation consent',
    example: true,
  })
  granted: boolean;
}
