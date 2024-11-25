import { User } from "src/authentication/entities/authentication.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  withdrawal_Id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amountCashedOut: number;

  @Column()
  date: Date;

  @Column()
  mobile: string;

  @Column()
  status: string;

  @Column()
  transID: string;

  @ManyToOne(() => User, (user) => user.withdrawals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sellerUserId' })
  seller: User;
}
