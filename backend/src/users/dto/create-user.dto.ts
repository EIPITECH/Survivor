import {IsEmail, IsString, IsNotEmpty, MinLength} from 'class-validator'; 
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @IsNotEmpty() @IsString()
    @ApiProperty({
        description: 'User\'s first name',
        example: 'Jane',
    })
    firstName: string
    
    @IsNotEmpty() @IsString()
    @ApiProperty({
        description: 'User\'s last name',
        example: 'Doe',
    })
    lastName: string
    
    @IsNotEmpty() @IsEmail({}, {message: 'Email invalide'})
    @ApiProperty({
        description: 'User\'s email address',
        example: 'jane.doe@domain.org',
    })
    email: string

    @IsNotEmpty() @IsString()
    @ApiProperty({
        description: 'User\'s hashed password',
        example: '$2a$05$LhayLxezLhK1LhWvKxCyLOj0j1u.Kj0jZ0pEmm134uzrQlFvQJLF6',
    })
    password: string
}
