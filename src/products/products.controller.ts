import { Controller, Post, UseInterceptors, UploadedFile, Body, Param, Get, UseGuards, Req, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AuthGuard } from 'src/authentication/guards/authentication.guard';
import { RoleGuardAuth } from 'src/authentication/guards/roles.guard';
import { Roles } from 'src/authentication/decorator/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}


  @UseGuards(AuthGuard,RoleGuardAuth)
  @Roles(['seller'])
  @Post('post')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,@Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId=req.userId
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    return this.productsService.create(createProductDto,userId, imageUrl);
  }
  
  @Get('buy:')  // Query parameter
  async findOneProduc(@Query('productId') productId: string): Promise<any> {
    return await this.productsService.findOneProduc(productId);
  }

  @Get()
  async getRandomProducts() {
    return await this.productsService.getRandomProducts();
  }

}



