import { Module } from '@nestjs/common';
import { CommandHistoryService } from './command-history.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [CommandHistoryService, PrismaService],
  exports: [CommandHistoryService],
})
export class CommandHistoryModule {}
