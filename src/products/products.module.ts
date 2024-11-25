import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/authentication/entities/authentication.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Products,User])],
  providers: [ProductsService,CloudinaryService],
  controllers: [ProductsController]
})
export class ProductsModule {}
