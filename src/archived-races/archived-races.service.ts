import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ArchivedRacesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.race.findMany({
      where: {
        status: 'finished',
      },
      orderBy: {
        startTime: 'desc',
      },
      include: {
        sessions: {
          include: {
            user: true,
            vehicle: true,
          },
        },
      },
    });
  }
}
