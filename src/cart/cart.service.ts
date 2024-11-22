import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './create-cart.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async addToCart(createCartDto: CreateCartDto, file: Express.Multer.File): Promise<Cart> {
    let imageUrl: string;
    try {
      imageUrl = await this.cloudinaryService.uploadImage(file);
    } catch (error) {
      throw new InternalServerErrorException('Image upload failed');
    }

    const existingItem = await this.cartRepository.findOne({
      where: { userId: createCartDto.userId, productId: createCartDto.productId },
    });

    if (existingItem) {
      existingItem.quantity += createCartDto.quantity;
      return this.cartRepository.save(existingItem);
    }

    const cartItem = this.cartRepository.create({ ...createCartDto, image: imageUrl });
    return this.cartRepository.save(cartItem);
  }
}

