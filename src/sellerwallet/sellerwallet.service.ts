import { Injectable } from '@nestjs/common';
import { CreateSellerwalletDto } from './dto/create-sellerwallet.dto';
import { UpdateSellerwalletDto } from './dto/update-sellerwallet.dto';

@Injectable()
export class SellerwalletService {
  create(createSellerwalletDto: CreateSellerwalletDto) {
    return 'This action adds a new sellerwallet';
  }

  findAll() {
    return `This action returns all sellerwallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sellerwallet`;
  }

  update(id: number, updateSellerwalletDto: UpdateSellerwalletDto) {
    return `This action updates a #${id} sellerwallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} sellerwallet`;
  }
}
