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

@Injectable()
export class PaymentsService {
  constructor(
    private readonly httpService: HttpService,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,

    @InjectRepository(Sellerwallet)
    private readonly sellerwalletRepository: Repository<Sellerwallet>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  private generateUniqueTransactionReference(): string {
    return uuidv4();
  }

  async create(productId: string, userId: string) {
    const buyer = await this.userRepository.findOne({ where: { userId } });
    if (!buyer) throw new UnauthorizedException('Buyer not found');

    const product = await this.productRepository.findOne({
      where: { productId },
      relations: ['seller'],
    });
    if (!product) throw new NotFoundException('Product not found');

    const tx_ref = this.generateUniqueTransactionReference();
    const options = {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer sec-test-p4skvgLUHNJfxJJn17TGOIBaQOaeEyvS',
      },
    };

    // Save a pending payment record with tx_ref and productId
    const pendingPayment = this.paymentRepository.create({
      status: 'pending',
      tx_ref,
      customer:buyer.userId,
      buyer,
      seller:product.seller.userId,
      productId,
      customer_email: buyer.email,
      amount: product.price,
      date: new Date(),
    });
    await this.paymentRepository.save(pendingPayment);

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.paychangu.com/payment',
          {
            tx_ref,
            callback_url: `https://6335-41-70-47-191.ngrok-free.app/callback`,
            return_url: 'https://6335-41-70-47-191.ngrok-free.app',
            currency: 'MWK',
            email: buyer.email,
            name: product.products_name,
            description: product.products_name,
            amount: product.price,
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
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.paychangu.com/verify-payment/${tx_ref}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer sec-test-p4skvgLUHNJfxJJn17TGOIBaQOaeEyvS',
            },
          },
        ),
      );

      const data = response.data;

      if (data.status === 'success') {
        const paymentDetails = data.data;

        // Retrieve the pending payment using tx_ref
        const pendingPayment = await this.paymentRepository.findOne({
          where: { tx_ref },
        });
        if (!pendingPayment)
          throw new NotFoundException(
            'Pending payment not found for verification.',
          );

        const product = await this.productRepository.findOne({
          where: { productId: pendingPayment.productId },
          relations: ['seller'],
        });
        if (!product)
          throw new NotFoundException(
            'Product not found for verified payment.',
          );

        let sellerWallet = await this.sellerwalletRepository.findOne({
          where: { seller: { userId: product.seller.userId } },
        });

        if (!sellerWallet) {
          sellerWallet = this.sellerwalletRepository.create({
            seller: product.seller,
            mainWalletBalance: 0,
          });
        }

        sellerWallet.mainWalletBalance += Number(paymentDetails.amount);
        console.log('statussss', paymentDetails.status);
        const verifiedPayment = this.paymentRepository.create({
          status: paymentDetails.status,
          tx_ref,
          amount: paymentDetails.amount,
          customer_email: paymentDetails.customer.email,
          date: new Date(paymentDetails.authorization.completed_at),
        });

        await this.paymentRepository.save(verifiedPayment);
        await this.sellerwalletRepository.save(sellerWallet);

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
