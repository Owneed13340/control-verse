import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 📄 Récupère le portefeuille d'un utilisateur
   */
  async getWalletByUserId(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      throw new NotFoundException('Portefeuille introuvable');
    }
    return wallet;
  }

  /**
   * 💰 Crédite le portefeuille
   */
  async creditWallet(userId: string, amount: number) {
    return this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: { increment: amount },
      },
    });
  }

  /**
   * 💸 Débite le portefeuille
   */
  async debitWallet(userId: string, amount: number) {
    const wallet = await this.getWalletByUserId(userId);
    if (wallet.balance < amount) {
      throw new Error('Fonds insuffisants');
    }

    return this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: { decrement: amount },
      },
    });
  }
}
