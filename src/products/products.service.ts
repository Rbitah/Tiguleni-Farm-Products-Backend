import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Products } from './products.entity';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/authentication/entities/authentication.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
  async findOneProduc(productId: string): Promise<any> {
    const product = await this.productsRepository.findOne({
      where: { productId: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const owner = await this.userRepository.findOne({
      where: { userId: product.seller.userId },
      select: ['userId', 'username'],
    });

    if (!owner) {
      throw new NotFoundException(`Owner with ID ${product.seller} not found`);
    }

    return {
      ...product,
      owner: {
        userId: owner.userId,
        username: owner.username,
      },
    };
  }
}
