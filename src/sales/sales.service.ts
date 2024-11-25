import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sales } from './entities/sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from 'src/payments/entities/payment.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sales)
    private salesRepository: Repository<Sales>,
    @InjectRepository(Payment)
    private readonly paymentRepository:Repository<Payment>
  ){}
  async getMonthlySalesData() {
    const sales = await this.salesRepository.find();

    const monthlyData = Array(12).fill(0); 

    sales.forEach(sale => {
      const month = sale.createdAt.getMonth();
      monthlyData[month] += sale.amount;
    });

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const lineChartData = {
      labels,
      datasets: [
        {
          label: 'Sales',
          data: monthlyData.slice(0, 12), 
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    };

    return lineChartData;
  }

  async getMonthlySalesDataBySeller(userId: string) {
    
    const sales = await this.salesRepository.find(
      { where: { seller: { userId: userId  } } 
    });

    const monthlyData = Array(12).fill(0);

    
    sales.forEach(sale => {
      const month = sale.createdAt.getMonth();
      monthlyData[month] += sale.amount;
    });

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const lineChartData = {
      labels,
      datasets: [
        {
          label: 'Sales',
          data: monthlyData.slice(0, 10), 
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    };

    return lineChartData;
  }
  async getProductTypeDistribution() {
    // Fetch all sales
    const sales = await this.salesRepository.find();

    // Aggregate sales by product type
    const productTypeTotals = sales.reduce((acc, sale) => {
      if (!acc[sale.productType]) {
        acc[sale.productType] = 0;
      }
      acc[sale.productType] += sale.amount;
      return acc;
    }, {});

    // Prepare data for the chart
    const labels = Object.keys(productTypeTotals);
    const data = Object.values(productTypeTotals);

    const pieChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 205, 86, 1)",
          ],
          hoverOffset: 4,
        },
      ],
    };

    return pieChartData;
  }

  async getAllSalesAdmin(): Promise<Payment[]> {
    return await this.paymentRepository.find(); 
  }

  async allSellerSales(userId:string){

    const sales = await this.paymentRepository.find({where:{seller:userId}})
    return {sales}
  }

  async allBuyerPurchase(userId:string){

    const sales = await this.paymentRepository.find({where: { buyer: { userId } }, })
    return {sales}
  }
}
