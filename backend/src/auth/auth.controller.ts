import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({summary: 'Pour se connecter, utilisez l\'email et le mot de passe renseignés lors de votre inscription.' })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
