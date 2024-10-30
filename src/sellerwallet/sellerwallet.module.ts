import { Module } from '@nestjs/common';
import { SellerwalletService } from './sellerwallet.service';
import { SellerwalletController } from './sellerwallet.controller';

@Module({
  controllers: [SellerwalletController],
  providers: [SellerwalletService],
})
export class SellerwalletModule {}
