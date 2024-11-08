import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { User } from 'src/authentication/entities/authentication.entity';
import { Products } from 'src/products/products.entity';
import { Payment } from './entities/payment.entity';
import { Sellerwallet } from 'src/sellerwallet/entities/sellerwallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[TypeOrmModule.forFeature([User,Products,Payment,Sellerwallet]),HttpModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
