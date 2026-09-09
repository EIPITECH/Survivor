import {IsEmail, IsString, IsNotEmpty, MinLength, IsEnum, minLength, ValidateIf, Matches} from 'class-validator'; 
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enum/user-role.enum';

export class CreateUserDto {
    @IsNotEmpty() @IsString()
    @ApiProperty({
        description: 'User first name',
        example: 'Jane',
    })
    firstName: string
    
    @IsNotEmpty() @IsString()
    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
    })
    lastName: string
    
    @IsNotEmpty() @IsEmail({}, {message: 'Email invalide'})
    @ApiProperty({
        description: 'User email address',
        example: 'jane.doe@domain.org',
    })
    email: string

    @IsNotEmpty() @IsString()
    @MinLength(11, {message: 'La taille du mot de passe doit être supérieure ou égale à 11 caractères'})
    @ApiProperty({
        description: 'User hashed password',
        example: 'SuperMotDePasse123!',
    })
    password: string

    @IsNotEmpty()
    @IsEnum(UserRole, { message: 'Veuillez sélectionner votre profil candidat ou recruteur' })
    @ApiProperty({
        description: 'User role',
        enum: UserRole,
        example: UserRole.SEEKER,
    })
    role: UserRole

    @ValidateIf((object) => object.role === UserRole.EMPLOYER)
    @IsNotEmpty({message: 'Le SIRET est obligatoire pour un compte employeur'})
    @IsString()
    @Matches(/^\d{14}$/, {
        message: 'Le SIRET doit contenir exactement 14 chiffres',
    })
    @ApiPropertyOptional({
        description: 'SIRET obligatoire pour les employeurs',
        example: '55210055400013',
    })
    siret?: string;

    
}

