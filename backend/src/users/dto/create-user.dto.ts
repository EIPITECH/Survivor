import {IsEmail, IsString, IsNotEmpty, MinLength, IsEnum, minLength} from 'class-validator'; 
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
}

