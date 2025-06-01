import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 🛒 Loue un objet du store pour un nombre de courses défini
   */
  async createRental(userId: string, itemId: string, remainingRaces: number) {
    const storeItem = await this.prisma.storeItem.findUnique({
      where: { id: itemId },
    });

    if (!storeItem || !storeItem.active || storeItem.type !== 'vehicle') {
      throw new NotFoundException('Objet de la boutique introuvable ou inactif.');
    }

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });

    if (!wallet || wallet.balance < storeItem.price) {
      throw new ForbiddenException('Solde insuffisant pour louer cet objet.');
    }

    // 💰 Débit du portefeuille
    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: storeItem.price } },
    });

    // 📦 Création de la location
    return this.prisma.rental.create({
      data: {
        userId,
        itemId,
        remainingRaces,
      },
    });
  }

  /**
   * 📋 Liste des locations actives (encore des courses restantes)
   */
  async getActiveRentals(userId: string) {
    return this.prisma.rental.findMany({
      where: {
        userId,
        remainingRaces: { gt: 0 },
      },
      include: {
        item: true,
      },
    });
  }

  /**
   * 🏁 Consomme une course (décrémente ou archive si dernière utilisation)
   */
  async consumeRace(userId: string, itemId: string) {
    const rental = await this.prisma.rental.findFirst({
      where: {
        userId,
        itemId,
        remainingRaces: { gt: 0 },
      },
      include: { item: true },
    });

    if (!rental) {
      throw new NotFoundException('Aucune location active trouvée pour cet objet.');
    }

    const isLastUse = rental.remainingRaces <= 1;

    if (isLastUse) {
      // 🗃️ Archivage
      await this.prisma.archivedRental.create({
        data: {
          userId: rental.userId,
          itemId: rental.itemId,
          totalUses: rental.remainingRaces,
        },
      });

      await this.prisma.rental.delete({ where: { id: rental.id } });

      return { message: 'Location terminée et archivée.' };
    }

    // ➖ Décrémentation
    return this.prisma.rental.update({
      where: { id: rental.id },
      data: {
        remainingRaces: { decrement: 1 },
      },
    });
  }
}

