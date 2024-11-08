
import { Injectable } from '@nestjs/common';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';

@Injectable()
export class WithdrawalsService {
  create(createWithdrawalDto: CreateWithdrawalDto) {
    return 'This action adds a new withdrawal';
  }

}
