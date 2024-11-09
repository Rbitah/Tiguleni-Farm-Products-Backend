import { Controller, Get, Body } from '@nestjs/common';
import { SellerwalletService } from './sellerwallet.service';

@Controller('sellerwallet')
export class SellerwalletController {
  constructor(private readonly sellerwalletService: SellerwalletService) {}

  @Get()
  sellerWallet(@Body() userId: string) {
    return this.sellerwalletService.sellerWallet(userId);
  }
}
