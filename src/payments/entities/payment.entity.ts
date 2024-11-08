import { User } from "src/authentication/entities/authentication.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  payment_Id: number;

  @Column()
  customer: string;

  @Column()
  seller: string;

  @Column()
 productId: string;

  @Column()
  customer_email: string;

  @Column('decimal')
  amount: number;

  @Column()
  quantityBought: string;

  @Column()
  date: Date;

  @Column()
  status:string

  @Column()
  tx_ref:string

  @ManyToOne(() => User, (user) => user.payments)
  buyer: User;
}
