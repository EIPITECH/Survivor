import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({summary: 'Pour se connecter, utilisez l\'email et le mot de passe renseignés lors de votre inscription.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'jane.doe@domain.org' },
        password: { type: 'string', example: 'SuperMotDePasse123!' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Connexion réussie, retourne un accessToken JWT',
    schema: {
      type: 'object',
      properties: { accessToken: { type: 'string' } },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Email ou mot de passe invalide' })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
