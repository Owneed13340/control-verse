import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';
import { AuthService } from './auth.service';
import { Token } from './models/token.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un compte' })
  register(@Body() dto: RegisterDto): Promise<Token> {
    return this.authService.createUser(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion' })
  login(@Body() dto: LoginDto): Promise<Token> {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renouveler un token' })
  refresh(@Body() token: { refreshToken: string }): Token {
    return this.authService.refreshToken(token.refreshToken);
  }
}
