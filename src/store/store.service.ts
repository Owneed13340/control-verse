import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StoreItem, Purchase, Wallet } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 📦 Liste tous les objets en vente, triés par prix croissant
   */
  async listAllItems(): Promise<StoreItem[]> {
    return this.prisma.storeItem.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
    });
  }

  /**
   * 🔍 Récupère un objet du store par son ID
   */
  async getItemById(itemId: string): Promise<StoreItem> {
    const item = await this.prisma.storeItem.findUnique({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException(`L'objet avec l'ID ${itemId} est introuvable.`);
    }
    return item;
  }

  /**
   * 💰 Achète un objet avec vérification du solde
   */
  async purchaseItem(userId: string, itemId: string): Promise<Purchase> {
    const item = await this.getItemById(itemId);

    const wallet: Wallet | null = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException("Portefeuille introuvable pour cet utilisateur.");
    }

    if (wallet.balance < item.price) {
      throw new BadRequestException("Solde insuffisant.");
    }

    // Débit du portefeuille
    await this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: item.price,
        },
      },
    });

    // Création de l'achat
    const purchase = await this.prisma.purchase.create({
      data: {
        userId,
        itemId,
        price: item.price,
      },
    });

    return purchase;
  }
}
