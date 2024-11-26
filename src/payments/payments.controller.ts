import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Roles } from 'src/authentication/decorator/roles.decorator';
import { AuthGuard } from 'src/authentication/guards/authentication.guard';
import { RoleGuardAuth } from 'src/authentication/guards/roles.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard,RoleGuardAuth)
  @Roles(['buyer','seller'])
  @Post()
  create(@Req() req,@Body() body: { productId: string, quantity:number}) {
    const { productId, quantity} = body;
    console.log("we heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    const userId=req.user_Id
    return this.paymentsService.create(productId, quantity ,userId);
  }

  @Get('verifying/:tx_ref')
  async verifyPayment(@Param('tx_ref') tx_ref: string) {
    return this.paymentsService.verifyPayment(tx_ref);
  }
}
