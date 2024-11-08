import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellerwalletService } from './sellerwallet.service';
import { CreateSellerwalletDto } from './dto/create-sellerwallet.dto';
import { UpdateSellerwalletDto } from './dto/update-sellerwallet.dto';

@Controller('sellerwallet')
export class SellerwalletController {
  constructor(private readonly sellerwalletService: SellerwalletService) {}

  @Post()
  create(@Body() createSellerwalletDto: CreateSellerwalletDto) {
    return this.sellerwalletService.create(createSellerwalletDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerwalletService.findOne(+id);
  }

 
}
