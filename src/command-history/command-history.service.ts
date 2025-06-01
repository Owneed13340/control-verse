import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CommandHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async logCommand(data: {
    sessionId: string;
    userId: string;
    command: string;
    status: string;
  }) {
    return this.prisma.commandHistory.create({
      data,
    });
  }

  async getAllCommands() {
    return this.prisma.commandHistory.findMany({
      orderBy: { timestamp: 'desc' },
    });
  }
}

