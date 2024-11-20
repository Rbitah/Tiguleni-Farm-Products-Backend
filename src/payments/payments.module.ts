import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { User } from 'src/authentication/entities/authentication.entity';
import { Products } from 'src/products/products.entity';
import { Payment } from './entities/payment.entity';
import { Sellerwallet } from 'src/sellerwallet/entities/sellerwallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Sales } from 'src/sales/entities/sale.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Products, Payment, Sellerwallet,Sales]),JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn:configService.get<string>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
    HttpModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
