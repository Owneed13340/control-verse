import { Module } from '@nestjs/common';
import { ArchivedRentalService } from './archived-rental.service';
import { ArchivedRentalController } from './archived-rental.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ArchivedRentalController],
  providers: [ArchivedRentalService, PrismaService],
})
export class ArchivedRentalModule {}
