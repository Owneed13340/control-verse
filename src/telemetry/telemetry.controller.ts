import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TelemetryService } from './telemetry.service';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';
import { TelemetryResponseDto } from './dto/telemetry-response.dto';

@ApiTags('telemetry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  /**
   * 📤 POST /telemetry/:vehicleId
   * Envoie de données de télémétrie depuis le véhicule (Raspberry)
   */
  @Post(':vehicleId')
  @ApiOperation({ summary: 'Envoyer des données de télémétrie' })
  @ApiParam({ name: 'vehicleId', type: 'string', description: 'ID du véhicule' })
  @ApiResponse({ status: 201, description: 'Télémétrie enregistrée avec succès', type: TelemetryResponseDto })
  @ApiResponse({ status: 403, description: 'Ce véhicule ne vous appartient pas.' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async pushTelemetry(
    @Req() req: Request,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateTelemetryDto,
  ): Promise<TelemetryResponseDto> {
    const user = { id: req.user['userId'] }; // 🔧 Correction ici

    const owns = await this.telemetryService.checkOwnership(vehicleId, user.id);
    if (!owns) {
      throw new ForbiddenException("Ce véhicule ne vous appartient pas.");
    }

    return this.telemetryService.pushTelemetry(vehicleId, dto);
  }

  /**
   * 📥 GET /telemetry/:vehicleId
   * Récupère la dernière télémétrie (avec cache)
   */
  @Get(':vehicleId')
  @ApiOperation({ summary: 'Récupérer la dernière télémétrie d’un véhicule' })
  @ApiParam({ name: 'vehicleId', type: 'string', description: 'ID du véhicule' })
  @ApiResponse({ status: 200, description: 'Dernière télémétrie récupérée', type: TelemetryResponseDto })
  async getLatestTelemetry(
    @Param('vehicleId') vehicleId: string,
  ): Promise<TelemetryResponseDto> {
    return this.telemetryService.getLatestTelemetry(vehicleId);
  }
}
