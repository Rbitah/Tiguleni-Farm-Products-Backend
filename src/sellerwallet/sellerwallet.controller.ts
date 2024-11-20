import { Controller, Get, Body, UseGuards, Req } from '@nestjs/common';
import { SellerwalletService } from './sellerwallet.service';
import { AuthGuard } from 'src/authentication/guards/authentication.guard';
import { RoleGuardAuth } from 'src/authentication/guards/roles.guard';
import { Roles } from 'src/authentication/decorator/roles.decorator';

@Controller('sellerwallet')
export class SellerwalletController {
  constructor(private readonly sellerwalletService: SellerwalletService) {}

  @UseGuards(AuthGuard,RoleGuardAuth)
  @Roles(['seller'])
  @Get()
  sellerWallet(@Req() req) {
    const userId =req.userId
    return this.sellerwalletService.sellerWallet(userId);
  }
}
