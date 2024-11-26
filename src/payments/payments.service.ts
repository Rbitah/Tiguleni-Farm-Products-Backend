import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Products } from 'src/products/products.entity';
import { Sellerwallet } from 'src/sellerwallet/entities/sellerwallet.entity';
import { User } from 'src/authentication/entities/authentication.entity';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Sales } from 'src/sales/entities/sale.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,

    @InjectRepository(Sellerwallet)
    private readonly sellerwalletRepository: Repository<Sellerwallet>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    
    @InjectRepository(Sales)
    private readonly salesRepository: Repository<Sales>,
  ) {}

  private generateUniqueTransactionReference(): string {
    return uuidv4();
  }

  async create(productId: string, quantity:number, userId: string) {
    const buyer = await this.userRepository.findOne({ where: { userId } });
    if (!buyer) throw new UnauthorizedException('Buyer not found');

    const slicedProductId = productId.slice(1);

    console.log("response reuhuuuuuturned");
    const product = await this.productRepository.findOne({
      where: { productId: slicedProductId },
      relations: ['seller'],
    });
    console.log(productId)
    if (!product) throw new NotFoundException('Product not found');

    const tx_ref = this.generateUniqueTransactionReference();
    const options = {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${this.configService.get('PAYCHANGU_API_KEY')}`,
      },
    };

    const totalamount=quantity*product.price
    // Save a pending payment record with tx_ref and productId
    const pendingPayment = this.paymentRepository.create({
      status: 'pending',
      tx_ref,
      quantityBought:`${quantity}`,
      customerEmail: buyer.email,
      product_name:product.products_name,
      buyer,
      seller: product.seller.userId,
      productId:slicedProductId,
      amount: totalamount,
      date: new Date(),
    });
    await this.paymentRepository.save(pendingPayment);

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.paychangu.com/payment',
          {
            tx_ref,
            callback_url: this.configService.get('CALLBACK_URL'),
            return_url: this.configService.get('RETURN_URL'),
            currency: 'MWK',
            email: buyer.email,
            name: product.products_name,
            description: product.products_name,
            amount: totalamount,
          },
          options,
        ),
      );

      const data = response.data;
      if (data.status === 'success') {
        return {
          statusCode: 200,
          message: 'Payment initiated successfully.',
          data: data.data,
        };
      } else {
        throw new HttpException(
          data.message || 'Payment initiation failed.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error(
        'Error processing payment:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data?.message ||
          'An error occurred while processing payment.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyPayment(tx_ref: string): Promise<any> {
    try {
      const pendingPayment = await this.paymentRepository.findOne({
        where: { tx_ref },
      });
  
      if (!pendingPayment)
        throw new NotFoundException(
          'Pending payment not found for verification.',
        );
  
      if (pendingPayment.status === 'success' || pendingPayment.status === 'success') {
        return {
          statusCode: 200,
          message: 'Payment has already been verified.',
        };
      }
  
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.paychangu.com/verify-payment/${tx_ref}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${this.configService.get('PAYCHANGU_API_KEY')}`,
            },
          },
        ),
      );
  
      const data = response.data;
  
      if (data.status === 'success') {
        const paymentDetails = data.data;
  
        const product = await this.productRepository.findOne({
          where: { productId: pendingPayment.productId },
          relations: ['seller'],
        });
        if (!product)
          throw new NotFoundException(
            'Product not found for verified payment.',
          );
  
        const productType = product.products_name;
        const userId = product.seller.userId;
  
        let sellerWallet = await this.sellerwalletRepository.findOne({
          where: { seller: { userId } },
        });
  
        if (!sellerWallet) {
          sellerWallet = this.sellerwalletRepository.create({
            seller: product.seller,
            mainWalletBalance: 0,
          });
        }
  
        sellerWallet.mainWalletBalance += Number(paymentDetails.amount);
        sellerWallet.totalNumberOfSales += 1;
        sellerWallet.totalSales += 1;
        pendingPayment.status = 'success';
        pendingPayment.amount = paymentDetails.amount;
        pendingPayment.customerEmail = paymentDetails.customer.email;
        pendingPayment.date = new Date(paymentDetails.authorization.completed_at);
  
        await this.paymentRepository.save(pendingPayment);
        await this.sellerwalletRepository.save(sellerWallet);
  
        const newSale = await this.salesRepository.create({
          amount: paymentDetails.amount,
          productType,
          seller: { userId },
        });
        await this.salesRepository.save(newSale);
  
        return {
          statusCode: 200,
          message: 'Payment verified and saved successfully.',
          data: paymentDetails,
        };
      } else {
        throw new HttpException(
          data.message || 'Payment verification failed.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error(
        'Error verifying payment:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data?.message ||
          'An error occurred while verifying payment.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

}
