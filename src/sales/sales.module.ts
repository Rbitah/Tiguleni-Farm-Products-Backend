import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from './entities/sale.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Payment } from 'src/payments/entities/payment.entity';
import { User } from 'src/authentication/entities/authentication.entity';
import { Products } from 'src/products/products.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Sales,Payment,Products,User]),JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn:configService.get<string>('JWT_EXPIRATION') },
    }),
    inject: [ConfigService],
  }),],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
