import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('store')
@UseGuards(JwtAuthGuard)
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * 📦 GET /store
   * Liste tous les objets disponibles dans la boutique
   */
  @Get()
  async listItems() {
    return this.storeService.listAllItems();
  }

  /**
   * 🔍 GET /store/:id
   * Récupère un objet du store par ID
   */
  @Get(':id')
  async getItem(@Param('id') id: string) {
    return this.storeService.getItemById(id);
  }

  /**
   * 🛒 POST /store/:id/purchase
   * Achète un objet du store
   */
  @Post(':id/purchase')
  async purchaseItem(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.storeService.purchaseItem(userId, id);
  }
}
