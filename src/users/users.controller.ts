import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserInput } from './dto/update-user.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 👤 GET /users/me
   * Récupère le profil de l'utilisateur connecté
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Récupérer le profil utilisateur connecté' })
  async getMe(@Req() req: Request): Promise<UserDto> {
    const userId = (req.user as any).userId;
    return this.usersService.getUserById(userId);
  }

  /**
   * 📝 PATCH /users/me
   * Met à jour les infos de l'utilisateur connecté
   */
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Mettre à jour le profil utilisateur connecté' })
  async updateMe(
    @Req() req: Request,
    @Body() updateUserInput: UpdateUserInput,
  ): Promise<UserDto> {
    const userId = (req.user as any).userId;
    return this.usersService.updateUser(userId, updateUserInput);
  }

  /**
   * 🔒 PATCH /users/me/password
   * Change le mot de passe de l'utilisateur connecté
   */
  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  @ApiOperation({ summary: 'Changer le mot de passe utilisateur' })
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordInput: ChangePasswordInput,
  ) {
    const userId = (req.user as any).userId;
    const currentPassword = (req.user as any).password;
    return this.usersService.changePassword(
      userId,
      currentPassword,
      changePasswordInput,
    );
  }

  /**
   * 🔍 GET /users/:id
   * Récupère un utilisateur par ID
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiParam({ name: 'id', type: 'string' })
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.getUserById(id);
  }
}

