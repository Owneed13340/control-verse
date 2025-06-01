import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('rental')
@UseGuards(JwtAuthGuard)
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  /**
   * 🛒 POST /rental/:itemId
   * Loue un objet (voiture) pour un nombre de courses donné
   */
  @Post(':itemId')
  @ApiParam({ name: 'itemId', type: String, description: 'ID de l’objet du store à louer' })
  @ApiBody({ schema: { properties: { uses: { type: 'number', example: 3 } } } })
  async rentItem(
    @Param('itemId') itemId: string,
    @Body('uses') uses: number,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).userId;
    return this.rentalService.createRental(userId, itemId, uses);
  }

  /**
   * 📦 GET /rental
   * Liste les locations actives du joueur
   */
  @Get()
  async getActiveRentals(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.rentalService.getActiveRentals(userId);
  }

  /**
   * 🏁 PATCH /rental/:itemId/use
   * Décrémente 1 utilisation d'une voiture louée (à appeler à la fin d'une course)
   */
  @Patch(':itemId/use')
  @ApiParam({ name: 'itemId', type: String, description: 'ID de l’objet loué' })
  async useRental(@Param('itemId') itemId: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.rentalService.consumeRace(userId, itemId);
  }
}
