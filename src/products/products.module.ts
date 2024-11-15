import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports:[TypeOrmModule.forFeature([Products])],
  providers: [ProductsService,CloudinaryService],
  controllers: [ProductsController]
})
export class ProductsModule {}
