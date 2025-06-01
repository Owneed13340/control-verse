import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ArchivedRentalService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔁 Récupère toutes les anciennes locations d'un joueur
  async getArchivedRentalsByUser(userId: string) {
    return this.prisma.archivedRental.findMany({
      where: { userId },
      include: { item: true },
    });
  }
}
