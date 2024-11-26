import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/authentication/entities/authentication.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Feedback } from 'src/ratesandreviews/entities/ratesandreview.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Products,User,Feedback]),JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn:configService.get<string>('JWT_EXPIRATION') },
    }),
    inject: [ConfigService],
  }),],
  providers: [ProductsService,CloudinaryService],
  controllers: [ProductsController]
})
export class ProductsModule {}
