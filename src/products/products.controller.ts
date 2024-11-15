import { Controller,Get,Put,Delete,Param,Post } from '@nestjs/common';

@Controller('products')
export class ProductsController {
    constructor(){};
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

}


