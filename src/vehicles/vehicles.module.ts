import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { PrismaModule } from '../prisma.module'; // <-- ajout

@Module({
  imports: [PrismaModule], // <-- ajout ici aussi
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
