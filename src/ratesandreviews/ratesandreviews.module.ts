import { Module } from '@nestjs/common';
import { RatesandreviewsService } from './ratesandreviews.service';
import { RatesandreviewsController } from './ratesandreviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/authentication/entities/authentication.entity';
import { Feedback } from './entities/ratesandreview.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[TypeOrmModule.forFeature([User,Feedback]),JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn:configService.get<string>('JWT_EXPIRATION') },
    }),
    inject: [ConfigService],
  }),],
  controllers: [RatesandreviewsController],
  providers: [RatesandreviewsService],
})
export class RatesandreviewsModule {}
