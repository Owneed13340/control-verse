import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        name: dto.name,
        type: dto.type,
        status: dto.status ?? 'available',
        battery: dto.battery ?? 100,
        model: {
          connect: { id: dto.modelId },
        },
        user: {
          connect: { id: userId },
        },
      },
      include: {
        model: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.vehicle.findMany({
      where: { userId },
      include: {
        model: true,
      },
    });
  }

  async update(userId: string, vehicleId: string, dto: UpdateVehicleDto) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) throw new NotFoundException('Véhicule introuvable');
    if (vehicle.userId !== userId) throw new ForbiddenException('Accès refusé');

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: dto,
      include: {
        model: true,
      },
    });
  }

  async remove(userId: string, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) throw new NotFoundException('Véhicule introuvable');
    if (vehicle.userId !== userId) throw new ForbiddenException('Accès refusé');

    return this.prisma.vehicle.delete({
      where: { id: vehicleId },
      include: {
        model: true,
      },
    });
  }
}
