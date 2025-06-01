import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ControlService } from './control.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('control')
@UseGuards(JwtAuthGuard)
@Controller('control')
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  @Post('start')
  @ApiOperation({ summary: 'Démarrer le véhicule' })
  start() {
    return this.controlService.start();
  }

  @Post('stop')
  @ApiOperation({ summary: 'Arrêter le véhicule' })
  stop() {
    return this.controlService.stop();
  }

  @Post('forward')
  @ApiOperation({ summary: 'Avancer' })
  forward() {
    return this.controlService.forward();
  }

  @Post('backward')
  @ApiOperation({ summary: 'Reculer' })
  backward() {
    return this.controlService.backward();
  }

  @Post('left')
  @ApiOperation({ summary: 'Tourner à gauche' })
  left() {
    return this.controlService.left();
  }

  @Post('right')
  @ApiOperation({ summary: 'Tourner à droite' })
  right() {
    return this.controlService.right();
  }
}
