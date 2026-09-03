import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from './enum/user-role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== +id) {
      throw new ForbiddenException("Vous ne pouvez consulter que votre propre compte");
    }
    return this.usersService.findOne(+id);
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
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== +id) {
      throw new ForbiddenException("Vous ne pouvez supprimer que votre propre compte");
    }
    return this.usersService.remove(+id);
  }
}
