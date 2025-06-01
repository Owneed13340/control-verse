import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { VehicleModelsService } from './vehicle-models.service';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VehicleModelResponseDto } from './dto/vehicle-model-response.dto';

@ApiTags('vehicle-models')
@Controller('vehicle-models')
export class VehicleModelsController {
  constructor(private readonly vehicleModelsService: VehicleModelsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des modèles de véhicules disponibles à l’achat' })
  @ApiResponse({ status: 200, type: [VehicleModelResponseDto] })
  findAll(): Promise<VehicleModelResponseDto[]> {
    return this.vehicleModelsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau modèle de véhicule (admin/dev)' })
  create(@Body() dto: CreateVehicleModelDto) {
    return this.vehicleModelsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Voir un modèle de véhicule spécifique' })
  findOne(@Param('id') id: string) {
    return this.vehicleModelsService.findOne(id);
  }
}

