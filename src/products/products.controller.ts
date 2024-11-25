import { Controller, Post, UseInterceptors, UploadedFile, Body, Param, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, file);
  }
  
  @Get(':productId')
  async findOneProduct(@Param('productId') productId: string): Promise<any> {
    return await this.productsService.findOneProduc(productId);
  }

}



