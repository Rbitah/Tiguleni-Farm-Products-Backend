import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { Products } from 'src/products/products.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Withdrawal } from 'src/withdrawals/entities/withdrawal.entity';
import { Sellerwallet } from 'src/sellerwallet/entities/sellerwallet.entity';
import { Sales } from 'src/sales/entities/sale.entity';
import { Feedback } from 'src/ratesandreviews/entities/ratesandreview.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ type: 'enum', enum: Role, default: Role.BUYER })
  role: Role;

  @OneToMany(() => Products, (product) => product.seller)
  products: Products[];

  @OneToMany(() => Payment, (payment) => payment.buyer)
  payments: Payment[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.seller)
  withdrawals: Withdrawal[];

  @OneToOne(() => Sellerwallet, (wallet) => wallet.seller)
  wallet: Sellerwallet;

  @OneToMany(() => Sales, (sale) => sale.seller)  
  sale: Sales[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];
}



