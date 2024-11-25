import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';
import { AuthGuard } from 'src/authentication/guards/authentication.guard';
import { RoleGuardAuth } from 'src/authentication/guards/roles.guard';
import { Roles } from 'src/authentication/decorator/roles.decorator';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post('cash-out')
  cashoutMobile(@Body() createWithdrawalDto: CreateWithdrawalDto) {
    return this.withdrawalsService.cashoutMobile(createWithdrawalDto);
  }

  @UseGuards(AuthGuard, RoleGuardAuth)
  @Roles(['seller'])
  @Get('seller-withdrwals')
  async getWithdrawalsList(@Req() req) {
    const userId = req.userId;
    const withdrawals =
      await this.withdrawalsService.getWithdrawalsList(userId);
    return withdrawals;
  }

  @UseGuards(AuthGuard, RoleGuardAuth)
  @Roles(['admin'])
  @Get('admin-withdrawals')
  async getAdminWithdrawalsList() {
    const withdrawals = await this.withdrawalsService.adminWithdrawalsList();
    return withdrawals;
  }
}
