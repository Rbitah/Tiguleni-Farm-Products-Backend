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


  async getAdminSummary() {
    const [result] = await this.sellerwalletRepository
      .createQueryBuilder('wallet')
      .select([
        'SUM(wallet.totalNumberOfSales) as totalNumberOfSales',
        'SUM(wallet.totalSales) as totalSales',
        'SUM(wallet.totalNumberOfWithdrawals) as totalNumberOfWithdrawals',
        'SUM(wallet.totalCashOut) as totalCashOut',
        'SUM(wallet.mainWalletBalance) as totalMainWalletBalance',
      ])
      .getRawMany();

    return {
      totalNumberOfSales: parseInt(result.totalNumberOfSales, 10) || 0,
      totalSales: parseFloat(result.totalSales) || 0,
      totalNumberOfWithdrawals: parseInt(result.totalNumberOfWithdrawals, 10) || 0,
      totalCashOut: parseFloat(result.totalCashOut) || 0,
      totalMainWalletBalance: parseFloat(result.totalMainWalletBalance) || 0,
    };
  }
}
