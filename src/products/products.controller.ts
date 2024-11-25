import { Controller,Get,Put,Delete,Param,Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(
      private readonly productsService:ProductsService
    ){};
    @Post()
  create(): string {
    return ;
  }
  @Get(':id')
findOne(@Param('id') id: string): string {
  return ;
}
@Put(':id')
  update(@Param('id') id: string) {
    return;
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return ;
  }

  @Get(':productId')
  async findOneProduct(@Param('productId') id: string): Promise<any> {
    return await this.productsService.findOneProduc(id);
  }

}


