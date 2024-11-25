import {Controller,Post,Body,UploadedFile,UseInterceptors,} from '@nestjs/common';
  import { CartService } from './cart.service';
  import { CreateCartDto } from './create-cart.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  
  @Controller('cart')
  export class CartController {
    constructor(private readonly cartService: CartService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async addToCart(
      @Body() createCartDto: CreateCartDto,
      @UploadedFile() file: Express.Multer.File,
    ) {
      return this.cartService.addToCart(createCartDto, file);
    }
  }
  