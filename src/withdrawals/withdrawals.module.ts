import { Module } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalsController } from './withdrawals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/authentication/entities/authentication.entity';
import { Withdrawal } from './entities/withdrawal.entity';
import { Sellerwallet } from 'src/sellerwallet/entities/sellerwallet.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[TypeOrmModule.forFeature([User,Withdrawal,Sellerwallet]),HttpModule,JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn:configService.get<string>('JWT_EXPIRATION') },
    }),
    inject: [ConfigService],
  })],
  controllers: [WithdrawalsController],
  providers: [WithdrawalsService],
})
export class WithdrawalsModule {}
