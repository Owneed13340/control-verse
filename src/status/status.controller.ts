import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('status')
@Controller('status')
export class StatusController {
  @Get()
  @ApiOperation({ summary: 'Obtenir le statut général du système' })
  getSystemStatus() {
    // à implémenter
  }

  @Get('vehicle')
  @ApiOperation({ summary: 'Obtenir le statut du véhicule actuel' })
  getVehicleStatus() {
    // à implémenter
  }

  @Get('connection')
  @ApiOperation({ summary: 'Obtenir le statut de la connexion (Unity / Raspberry)' })
  getConnectionStatus() {
    // à implémenter
  }
}

