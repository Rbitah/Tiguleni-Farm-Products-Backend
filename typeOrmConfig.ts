import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/authentication/entities/authentication.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Withdrawal } from 'src/withdrawals/entities/withdrawal.entity';
import { Sellerwallet } from 'src/sellerwallet/entities/sellerwallet.entity';
import { Products } from 'src/products/products.entity';
import { Token } from 'src/authentication/entities/reset.entity';
import { Sales } from 'src/sales/entities/sale.entity';
import { Feedback } from 'src/ratesandreviews/entities/ratesandreview.entity';
import { Profile } from 'src/userprofile/entities/userprofile.entity';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  // host: configService.get<string>('DB_HOST'),
  // port: configService.get<number>('DB_PORT'),
  // username: configService.get<string>('DB_USERNAME'),
  // password: configService.get<string>('DB_PASSWORD'),
  // database: configService.get<string>('DB_NAME'),
  url:configService.get<string>('MYSQL_PUBLIC_URL'), 
  entities: [User,Payment,Withdrawal,Sellerwallet,Products,Token,Sales,Feedback,Profile],
  synchronize:false,
  logging: true,
});
