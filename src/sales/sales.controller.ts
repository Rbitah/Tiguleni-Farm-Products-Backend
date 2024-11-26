import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Roles } from 'src/authentication/decorator/roles.decorator';
import { AuthGuard } from 'src/authentication/guards/authentication.guard';
import { RoleGuardAuth } from 'src/authentication/guards/roles.guard';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('allsalesAdmin')
  async getDashboardData() {
    return await this.salesService.getMonthlySalesData();
  }

  @UseGuards(AuthGuard,RoleGuardAuth)
   @Roles(['seller'])
  @Get('dashboard/seller')
  async getMonthlySalesDataBySeller(@Req() req, ) {
    return await this.salesService.getMonthlySalesDataBySeller(req.userId);
  }

  @Get('allSalesdistribution')
  async getProductTypeDistribution() {
    return this.salesService.getProductTypeDistribution();
  }

  @UseGuards(AuthGuard, RoleGuardAuth)
  @Roles(['admin']) 
  @Get('allsalesAdmin')
  async getSales() {
    const salesData = await this.salesService.getAllSalesAdmin();
    return salesData;
  }


  @UseGuards(AuthGuard, RoleGuardAuth)
  @Roles(['seller']) 
  @Get('sellersales')
  async allSellerSales(@Req() req){
    const userId=req.userId
    return this.salesService.allSellerSales(userId)
  }

  @UseGuards(AuthGuard,RoleGuardAuth)
  @Roles(['buyer']) 
  @Get('purchases')
  async allBuyerPurchase(@Req() req){
    const userId=req.userId
    return this.salesService.allBuyerPurchase(userId)
  }
}
