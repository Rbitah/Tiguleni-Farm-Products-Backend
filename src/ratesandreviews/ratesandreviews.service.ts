import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRatesandreviewDto } from './dto/create-ratesandreview.dto';
import { UpdateRatesandreviewDto } from './dto/update-ratesandreview.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/authentication/entities/authentication.entity';
import { Feedback } from './entities/ratesandreview.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RatesandreviewsService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  
  async createFeedback(
    createFeedbackDto: CreateRatesandreviewDto,
    userId: string,
  ) {
    // const user = await this.userRepository.findOne({
    //   where: { userId: userId },
    // });
    // if (!user) {
    //   throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    // }

    const feedback = this.feedbackRepository.create({
      ...createFeedbackDto,
      // user,
    });
    await this.feedbackRepository.save(feedback);
    return{message:"feedback sent"};
  }

  async getFeedbacksWithUserInfo(productId:string) {
   const feedbacks = await this.feedbackRepository.find({where: { productId }});
   return feedbacks
  }
}
