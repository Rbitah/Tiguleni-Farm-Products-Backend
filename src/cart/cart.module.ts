import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports:[TypeOrmModule.forFeature([Cart])],
  providers: [CartService,CloudinaryService],
  controllers: [CartController]
})
export class CartModule {}
