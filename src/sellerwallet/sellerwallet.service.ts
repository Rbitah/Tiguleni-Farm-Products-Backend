import { Injectable } from '@nestjs/common';
import { CreateSellerwalletDto } from './dto/create-sellerwallet.dto';
import { UpdateSellerwalletDto } from './dto/update-sellerwallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sellerwallet } from './entities/sellerwallet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SellerwalletService {
  constructor(
    @InjectRepository(Sellerwallet)
    private readonly sellerwalletRepository: Repository<Sellerwallet>,
  ) {}

  async sellerWallet(userId: string) {
    let sellerwallet = await this.sellerwalletRepository.findOne({
      where: { seller: { userId } },
    });
    if (!sellerwallet) {
      sellerwallet = this.sellerwalletRepository.create({
        seller: { userId },
        mainWalletBalance: 0,
        totalNumberOfSales: 0,
        totalSales: 0,
        totalNumberOfWithdrawals: 0,
        totalCashOut: 0,
      });
    }
    await this.sellerwalletRepository.save(sellerwallet);
    return { sellerwallet };
  }
}
