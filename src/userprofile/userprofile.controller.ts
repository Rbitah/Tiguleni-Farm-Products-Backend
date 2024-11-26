import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UseGuards } from '@nestjs/common';
import { UserprofileService } from './userprofile.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/authentication/guards/authentication.guard';
import { RoleGuardAuth } from 'src/authentication/guards/roles.guard';

@Controller('userprofile')
export class UserprofileController {
  constructor(private readonly userprofileService: UserprofileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}


  @UseGuards(AuthGuard)
  @Post('createprofile')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Req() req,@Body() body:{name},
    @UploadedFile() file: Express.Multer.File,
  ) {
    const {name}=body
    const userId=req.userId
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    return this.userprofileService.create(userId, name,imageUrl);
  }

  @UseGuards(AuthGuard)
  @Post('update-image')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Req() req, @Body() body:{name},
    @UploadedFile() file: Express.Multer.File,
  ) {
    const {name}=body
    const userId = req.userId;
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    return this.userprofileService.updateImage(userId,name, imageUrl);
  }

  @UseGuards(AuthGuard)
  @Get('userprofile')
  async getProfile(@Req() req) {
    const userId = req.userId; 
    return this.userprofileService.getProfile(userId);
  }
  
}
