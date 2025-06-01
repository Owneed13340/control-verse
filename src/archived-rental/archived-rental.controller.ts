import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ArchivedRentalService } from './archived-rental.service';

@UseGuards(JwtAuthGuard)
@Controller('archived-rentals')
export class ArchivedRentalController {
  constructor(private readonly archivedRentalService: ArchivedRentalService) {}

  /**
   * 📜 GET /archived-rentals
   * Récupère l'historique des voitures louées par le joueur
   */
  @Get()
  async getArchived(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.archivedRentalService.getArchivedRentalsByUser(userId);
  }
}
