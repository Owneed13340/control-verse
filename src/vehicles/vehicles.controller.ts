// src/vehicles/vehicles.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { VehicleDto } from './dto/vehicle.dto';

@ApiTags('vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  private toVehicleDto(v: any): VehicleDto {
    return {
      id: v.id,
      name: v.name,
      type: v.type,
      status: v.status,
      battery: v.battery,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt ?? new Date(),
      model: {
        id: v.model.id,
        name: v.model.name,
        type: v.model.type,
        status: v.model.status,
        description: v.model.description,
        imageUrl: v.model.imageUrl,
        defaultBattery: v.model.defaultBattery,
        price: v.model.price,
        speed: v.model.speed,
      },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Liste des véhicules liés au compte' })
  @ApiResponse({ status: 200, type: [VehicleDto] })
  async findAll(@Req() req): Promise<VehicleDto[]> {
    const userId = req.user['userId'];
    const vehicles = await this.vehiclesService.findAll(userId);
    return vehicles.map((v) => this.toVehicleDto(v));
  }

  @Post()
  @ApiOperation({ summary: 'Enregistrer un nouveau véhicule' })
  @ApiResponse({ status: 201, type: VehicleDto })
  async create(@Req() req, @Body() dto: CreateVehicleDto): Promise<VehicleDto> {
    const userId = req.user['userId'];
    const v = await this.vehiclesService.create(userId, dto);
    return this.toVehicleDto(v);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un véhicule' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: VehicleDto })
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleDto> {
    const userId = req.user['userId'];
    const v = await this.vehiclesService.update(userId, id, dto);
    return this.toVehicleDto(v);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un véhicule' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Véhicule supprimé avec succès' })
  async remove(@Req() req, @Param('id') id: string) {
    const userId = req.user['userId'];
    return this.vehiclesService.remove(userId, id);
  }
}
