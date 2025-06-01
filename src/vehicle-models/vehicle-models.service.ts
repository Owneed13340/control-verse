import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';

@Injectable()
export class VehicleModelsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vehicleModel.findMany();
  }

  async create(dto: CreateVehicleModelDto) {
    return this.prisma.vehicleModel.create({
      data: {
        ...dto,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.vehicleModel.findUnique({
      where: { id },
    });
  }
}
