import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, passwd: string): Promise<any> 
    {
        const user = await this.usersService.findByEmail(email);

        if (user && await bcrypt.compare(passwd, user.password)) {
            const { password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: User)
    {
        const payload = {email: user.email, sub: user.id, role: user.role};
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
