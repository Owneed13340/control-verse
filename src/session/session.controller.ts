import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { StartSessionDto } from './dto/start-session.dto';
import { EndSessionDto } from './dto/end-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('session')
@UseGuards(JwtAuthGuard)
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('start')
  @ApiOperation({ summary: 'Démarrer une session de jeu' })
  startSession(@Body() dto: StartSessionDto) {
    return this.sessionService.startSession(dto);
  }

  @Post('end')
  @ApiOperation({ summary: 'Terminer une session de jeu' })
  endSession(@Body() dto: EndSessionDto) {
    return this.sessionService.endSession(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir les informations de la session courante' })
  @ApiQuery({ name: 'sessionId', required: true })
  getSession(@Query('sessionId') sessionId: string) {
    if (!sessionId) {
      throw new HttpException('sessionId requis', HttpStatus.BAD_REQUEST);
    }
    return this.sessionService.getSession(sessionId);
  }

  @Get('status')
  @ApiOperation({ summary: 'Obtenir l’état actuel de la session' })
  @ApiQuery({ name: 'sessionId', required: true })
  getSessionStatus(@Query('sessionId') sessionId: string) {
    if (!sessionId) {
      throw new HttpException('sessionId requis', HttpStatus.BAD_REQUEST);
    }
    return this.sessionService.getSessionStatus(sessionId);
  }
}

