import {IsEmail, IsString, IsNotEmpty, MinLength, isNotEmpty, minLength} from 'class-validator'; 
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsEmail({}, {message: 'Email invalide'})
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @MinLength(10, {message: 'Le mot de passe doit faire minimum 10 caractères'})
    password: string
}
