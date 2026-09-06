import {IsEmail, IsString, IsNotEmpty, MinLength, IsEnum, minLength} from 'class-validator'; 
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSeekerDto {
    @IsString()
    @ApiProperty({
    description: 'seeker\'s skills',
    example: 'DevOps',
  })
  skills: string;

  @IsString()
  @ApiProperty({
      description: 'seeker\'s experience',
      example: '2 years as an Frontend developper',
  })
  experience: string;
  
  @IsString()
  @ApiProperty({
      description: 'seeker\'s availability',
      example: '12/02/2027 - 18/12/2027',
  })
  availability: string;
}
