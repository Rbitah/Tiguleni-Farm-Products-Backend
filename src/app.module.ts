// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'typeOrmConfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { AuthenticationModule } from './authentication/authentication.module';
=======
import { PaymentsModule } from './payments/payments.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { SellerwalletModule } from './sellerwallet/sellerwallet.module';
>>>>>>> 0f1282c28758dcdb20a9b53b2bfc44f058febfc2

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),

<<<<<<< HEAD
    ProductsModule,

=======
>>>>>>> 0f1282c28758dcdb20a9b53b2bfc44f058febfc2
    PaymentsModule,

    WithdrawalsModule,

<<<<<<< HEAD
    AuthenticationModule,
=======
    SellerwalletModule,
>>>>>>> 0f1282c28758dcdb20a9b53b2bfc44f058febfc2
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
