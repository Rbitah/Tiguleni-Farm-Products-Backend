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
import { Feedback } from 'src/ratesandreviews/entities/ratesandreview.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: string,
    imageUrl: string,
  ) {
    const seller = await this.userRepository.findOne({ where: { userId } });
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    try {
      const newProduct = this.productsRepository.create({
        ...createProductDto,
        imageUrl,
        seller: { userId },
      });

      await this.productsRepository.save(newProduct);
      return newProduct;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product');
    }
  }
  async findOneProduc(productId: string) {
    // Remove the character at index 0 of the productId
    const slicedProductId = productId.slice(1);

    console.log('response reuhuuuuuturned');
    const product = await this.productsRepository.findOne({
      where: { productId: slicedProductId },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${slicedProductId} not found`,
      );
    }

    if (!product.seller) {
      throw new NotFoundException(
        `Seller information for product ID ${slicedProductId} is missing`,
      );
    }

    // Fetch the seller's user details (owner)
    const owner = await this.userRepository.findOne({
      where: { userId: product.seller.userId },
      select: ['userId', 'username'],
    });

    if (!owner) {
      throw new NotFoundException(
        `Owner with ID ${product.seller.userId} not found`,
      );
    }
    return {
      productId: product.productId,
      products_name: product.products_name,
      price: product.price,
      location: product.location,
      quantity_amount: product.quantity_amount,
      quantity_metric: product.quantity_metric,
      imageUrl: product.imageUrl,
      userId: owner.userId,
      username: owner.username,
    };
  }

  async getRandomProducts() {
    const randomProducts = await this.productsRepository.find();

    return randomProducts;
  }
}
