import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserAccountStatus } from '../users/enum/user-account-status.enum';

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
            if (user.accountStatus === UserAccountStatus.SUSPENDED) {
                throw new UnauthorizedException("Votre compte a été suspendu");
            }
            const { password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: User)
    {
        const payload = {firstName: user.firstName, email: user.email, sub: user.id, role: user.role};
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
