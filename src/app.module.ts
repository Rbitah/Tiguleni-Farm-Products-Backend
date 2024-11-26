import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'typeOrmConfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { SellerwalletModule } from './sellerwallet/sellerwallet.module';
import { SalesModule } from './sales/sales.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { RatesandreviewsModule } from './ratesandreviews/ratesandreviews.module';
import { CartModule } from './cart/cart.module';
import { UserprofileModule } from './userprofile/userprofile.module';


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
    ProductsModule,
    PaymentsModule,
    WithdrawalsModule,
    AuthenticationModule,
    SellerwalletModule,
    SalesModule,
    CloudinaryModule,
    RatesandreviewsModule,
    CartModule,
    UserprofileModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
