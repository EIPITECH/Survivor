import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Administrator first name',
    example: 'Jane',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Administrator last name',
    example: 'Doe',
  })
  lastName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email invalide' })
  @ApiProperty({
    description: 'Administrator email address',
    example: 'jane.doe@job-et-bonheur.fr',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(11, {message: 'La taille du mot de passe doit être supérieure ou égale à 11 caractères'})
  @ApiProperty({
    description: 'Administrator password',
    example: 'SuperMotDePasse123!',
  })
  password: string;
}
