import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';
import { UserAccountStatus } from '../users/enum/user-account-status.enum';
import { User } from '../users/entities/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret as string,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException("Utilisateur introuvable");
    }
    if (user.accountStatus === UserAccountStatus.SUSPENDED) {
      throw new UnauthorizedException("Votre compte a été suspendu");
    }
    
    return { firstName: payload.firstName, userId: payload.sub, email: payload.email, role: payload.role};
  }
}
