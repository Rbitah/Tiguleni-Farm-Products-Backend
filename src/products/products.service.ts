import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Products } from './products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  async create(createProductDto: CreateProductDto, imageUrl) {
    try {
      const newProduct = this.productsRepository.create({
        ...createProductDto,
        imageUrl,
      });

      return await this.productsRepository.save(newProduct);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product');
    }
  }
}

