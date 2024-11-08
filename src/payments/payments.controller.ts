import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() body: { productId: string; userId: string }) {
    const { productId, userId } = body;
    return this.paymentsService.create(productId, userId);
  }

  @Get('verify/:tx_ref')
  async verifyPayment(@Param('tx_ref') tx_ref: string) {
    return this.paymentsService.verifyPayment(tx_ref);
  }
}
