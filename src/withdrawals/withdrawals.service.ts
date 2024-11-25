import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/authentication/entities/authentication.entity';
import { Sellerwallet } from 'src/sellerwallet/entities/sellerwallet.entity';
import { Withdrawal } from './entities/withdrawal.entity';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Sellerwallet)
    private readonly sellerWalletRepository: Repository<Sellerwallet>,
    @InjectRepository(Withdrawal)
    private readonly withdrwalRepository: Repository<Withdrawal>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly operatorRefIds = {
    '8': this.configService.get('TNM_Mpamba'),
    '9': this.configService.get('Airtel_Money'),
  };

  private generateUniqueTransactionReference(): string {
    return uuidv4();
  }

  private getMobileMoneyOperatorRefId(mobile: string): string {
    const prefix = mobile.charAt(0);
    const refId = this.operatorRefIds[prefix];
    if (!refId) {
      throw new HttpException(
        'Unsupported mobile number prefix.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return refId;
  }

  async cashoutMobile(createWithdrawalDto: CreateWithdrawalDto) {
    const { phoneNumber, amount, userId } = createWithdrawalDto;

    let mobile = phoneNumber;

    const seller = await this.userRepository.findOne({
      where: { userId: userId as any },
    });
    if (!seller) {
      throw new UnauthorizedException('User not found.');
    }

    const sellerBalance = await this.sellerWalletRepository.findOne({
      where: { seller: { userId: userId } },
    });
    if (!sellerBalance) {
      throw new UnauthorizedException('No wallet found.');
    }

    if (sellerBalance.mainWalletBalance < amount) {
      throw new UnauthorizedException("Seller's balance is low.");
    }

    const mobileMoneyOperatorRefId = this.getMobileMoneyOperatorRefId(mobile);
    const chargeId = this.generateUniqueTransactionReference();

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.paychangu.com/mobile-money/payouts/initialize',
          {
            mobile,
            mobile_money_operator_ref_id: mobileMoneyOperatorRefId,
            amount,
            charge_id: chargeId,
          },
          {
            headers: {
              Authorization: `Bearer ${this.configService.get('PAYCHANGU_API_KEY')}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (response.data.status === 'success') {
        const withdrawal = this.withdrwalRepository.create({
          amountCashedOut: response.data.amount,
          date: new Date(),
          mobile,
          status: 'success',
          seller,
          transID:chargeId
        });
        await this.withdrwalRepository.save(withdrawal);

        sellerBalance.mainWalletBalance -= amount;
        await this.sellerWalletRepository.save(sellerBalance);

        return response.data;
      } else {
        throw new HttpException(
          'Failed to initiate mobile money payout.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error(
        'Error initiating payout:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'An error occurred while processing payout.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async getWithdrawalsList(userId: string) {
    let allSellerwithdrwals = await this.withdrwalRepository.find({
      where: { seller: { userId: userId } },
      relations: ['seller'],
    });

    return { allSellerwithdrwals };
  }

  async adminWithdrawalsList(){
    try {
      const withdrawals = await this.withdrwalRepository.find();
      return withdrawals;
    } catch (error) {
      throw new Error('Error fetching withdrawals: ' + error.message);
    }
  }
}
