import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { RatesandreviewsService } from './ratesandreviews.service';
import { CreateRatesandreviewDto } from './dto/create-ratesandreview.dto';
import { UpdateRatesandreviewDto } from './dto/update-ratesandreview.dto';
import { AuthGuard } from 'src/authentication/guards/authentication.guard';
import { RoleGuardAuth } from 'src/authentication/guards/roles.guard';
import { Roles } from 'src/authentication/decorator/roles.decorator';

@Controller('ratesandreviews')
export class RatesandreviewsController {
  constructor(private readonly ratesandreviewsService: RatesandreviewsService) {}

  
  // @UseGuards(AuthGuard,RoleGuardAuth)
  // @Roles(['buyer','seller'])
  @Post('feedback')
  async createFeedback(
    @Body() createFeedbackDto: CreateRatesandreviewDto,
    @Req() req){
    const userId= "req.userId"
    return await this.ratesandreviewsService.createFeedback(createFeedbackDto, userId);
  }

  @Get('getFeedbacks/:productId')
  async getAllFeedbacks(@Param('productId') productId: string) {
    return await this.ratesandreviewsService.getFeedbacksWithUserInfo(productId);
  }
}
