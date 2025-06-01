import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from '../auth/password.service';
import { UpdateUserInput } from './dto/update-user.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  /**
   * 🔍 Récupérer un utilisateur par ID (sans mot de passe)
   */
  async getUserById(id: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return this.toUserDto(user);
  }

  /**
   * 📝 Met à jour les informations utilisateur
   */
  async updateUser(userId: string, newUserData: UpdateUserInput): Promise<UserDto> {
    const updatedUser = await this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });

    return this.toUserDto(updatedUser);
  }

  /**
   * 🔒 Changer le mot de passe de l'utilisateur
   */
  async changePassword(
    userId: string,
    currentPasswordHash: string,
    changePassword: ChangePasswordInput,
  ): Promise<UserDto> {
    const isValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      currentPasswordHash,
    );

    if (!isValid) {
      throw new BadRequestException('Mot de passe actuel invalide');
    }

    const newHashed = await this.passwordService.hashPassword(
      changePassword.newPassword,
    );

    const updated = await this.prisma.user.update({
      data: {
        password: newHashed,
      },
      where: { id: userId },
    });

    return this.toUserDto(updated);
  }

  /**
   * 🔁 Convertir une entité User en UserDto (sans mot de passe)
   */
  private toUserDto(user: any): UserDto {
    const { password, ...safeUser } = user;
    return safeUser as UserDto;
  }
}
