import { Module } from '@nestjs/common';
import { SellerwalletService } from './sellerwallet.service';
import { SellerwalletController } from './sellerwallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sellerwallet } from './entities/sellerwallet.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[TypeOrmModule.forFeature([Sellerwallet]),JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn:configService.get<string>('JWT_EXPIRATION') },
    }),
    inject: [ConfigService],
  }),],
  controllers: [SellerwalletController],
  providers: [SellerwalletService],
})
export class SellerwalletModule {}
