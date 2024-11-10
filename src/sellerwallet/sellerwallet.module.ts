import { Module } from '@nestjs/common';
import { SellerwalletService } from './sellerwallet.service';
import { SellerwalletController } from './sellerwallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sellerwallet } from './entities/sellerwallet.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Sellerwallet])],
  controllers: [SellerwalletController],
  providers: [SellerwalletService],
})
export class SellerwalletModule {}
