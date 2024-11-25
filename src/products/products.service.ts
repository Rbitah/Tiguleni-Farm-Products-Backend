import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Products } from './products.entity';
import { User } from 'src/authentication/entities/authentication.entity';

@Injectable()
export class ProductsService {
  findOneBy: any;
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  createproducts(products): Promise<null | Products> {
    return this.productsRepository.save(products);
  }
  getproducts(id: number): Promise<null | Products> {
    return this.findOneBy({ id });
  }
  searchByQuery(query): Promise<Products[]> {
    return this.productsRepository.find({
      where: [
        { products_name: ILike(`%${query}%`) },
        { location: ILike(`%${query}%`) },
      ],
    });
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
