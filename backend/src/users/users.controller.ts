import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam, ApiCreatedResponse, ApiOkResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { UserRole } from './enum/user-role.enum';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({summary: 'Crée un compte utilisateur (candidat ou employeur)'})
  @ApiCreatedResponse({ description: 'Compte créé' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @Post('admin')
  @ApiOperation({summary: "Crée un compte administrateur (administrateur uniquement)"})
  @ApiCreatedResponse({ description: 'Compte administrateur créé' })
  @ApiForbiddenResponse({ description: 'Accès réservé aux administrateurs' })
  createAdmin(@Body() createAdminDto: CreateAdminDto, @Request() req: any) 
  {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Accès réservé aux administrateurs");
    }
    return this.usersService.createAdmin(createAdminDto);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({summary: 'Récupère la liste de tous les utilisateurs (administrateur uniquement)'})
  @ApiOkResponse({ description: 'Liste des utilisateurs' })
  @ApiForbiddenResponse({ description: 'Accès réservé aux administrateurs' })
  findAll(@Request() req: any) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Accès réservé aux administrateurs");
    }
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/export')
  @ApiOperation({summary: 'Exporte les données personnelles de l\'utilisateur connecté'})
  @ApiOkResponse({ description: "Export des données personnelles de l'utilisateur connecté" })
  exportMyData(@Request() req: any) 
  {
    return this.usersService.exportPersonalData(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({summary: "Récupère un compte utilisateur par son ID (soi-même ou administrateur)"})
  @ApiParam({ name: 'id', description: 'ID utilisateur', example: 1 })
  @ApiOkResponse({ description: 'Compte utilisateur trouvé' })
  @ApiForbiddenResponse({ description: 'Vous ne pouvez consulter que votre propre compte' })
  findOne(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== +id) {
      throw new ForbiddenException("Vous ne pouvez consulter que votre propre compte");
    }
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/status')
  @ApiOperation({summary: 'Active ou suspend un compte utilisateur (administrateur)'})
  @ApiParam({ name: 'id', description: 'ID utilisateur', example: 1 })
  @ApiOkResponse({ description: 'Statut du compte mis à jour' })
  @ApiForbiddenResponse({ description: 'Accès réservé aux administrateurs' })
  updateAccountStatus(@Param('id', ParseIntPipe) id: number, @Body() updateUserStatusDto: UpdateUserStatusDto, @Request() req: any) 
  {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return this.usersService.updateAccountStatus(id, updateUserStatusDto.status, req.user.userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({summary: 'Met à jour un compte utilisateur (soi-même ou administrateur)'})
  @ApiParam({ name: 'id', description: 'ID utilisateur', example: 1 })
  @ApiOkResponse({ description: 'Compte utilisateur mis à jour' })
  @ApiForbiddenResponse({ description: 'Vous ne pouvez modifier que votre propre compte' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== +id) {
      throw new ForbiddenException("Vous ne pouvez modifier que votre propre compte");
    }
    if (req.user.role !== UserRole.ADMIN) {
      delete updateUserDto.role;
    }

    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('me')
  removeMe(@Request() req: any) 
  {
    return this.usersService.remove(req.user.userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({summary: 'Supprime un compte utilisateur (soi-même ou administrateur)'})
  @ApiParam({ name: 'id', description: 'ID utilisateur', example: 1 })
  @ApiOkResponse({ description: 'Compte supprimé' })
  @ApiForbiddenResponse({ description: 'Vous ne pouvez supprimer que votre propre compte' })
  remove(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== +id) {
      throw new ForbiddenException("Vous ne pouvez supprimer que votre propre compte");
    }
    return this.usersService.remove(+id);
  }
}
