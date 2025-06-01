import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { PrismaService } from '../prisma.service'; // si utilisé

@Module({
  controllers: [RentalController],
  providers: [RentalService, PrismaService],
  exports: [RentalService], // ✅ NÉCESSAIRE pour que SessionModule puisse l'utiliser
})
export class RentalModule {}
