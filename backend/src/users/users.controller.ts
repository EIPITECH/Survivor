import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException,ParseIntPipe  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from './enum/user-role.enum';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @Post('admin')
  @ApiOperation({summary: "Crée un compte administrateur (administrateur uniquement)"})
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
  findAll(@Request() req: any) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Accès réservé aux administrateurs");
    }
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/export')
  @ApiOperation({summary: 'Exporte les données personnelles de l’utilisateur connecté'})
  exportMyData(@Request() req: any) 
  {
    return this.usersService.exportPersonalData(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
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
  remove(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== +id) {
      throw new ForbiddenException("Vous ne pouvez supprimer que votre propre compte");
    }
    return this.usersService.remove(+id);
  }
}
