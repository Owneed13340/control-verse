import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { WalletService } from './wallet.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('wallet')
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallet(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.walletService.getWalletByUserId(userId);
  }

  @Post('credit')
  async creditWallet(
    @Req() req: Request,
    @Body('amount') amount: number,
  ) {
    const userId = (req.user as any).userId;
    return this.walletService.creditWallet(userId, amount);
  }

  @Post('debit')
  async debitWallet(
    @Req() req: Request,
    @Body('amount') amount: number,
  ) {
    const userId = (req.user as any).userId;
    return this.walletService.debitWallet(userId, amount);
  }
}
