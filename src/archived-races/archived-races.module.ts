import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ArchivedRacesService } from './archived-races.service';
import { ArchivedRacesController } from './archived-races.controller';

@Module({
  controllers: [ArchivedRacesController],
  providers: [ArchivedRacesService, PrismaService],
})
export class ArchivedRacesModule {}
