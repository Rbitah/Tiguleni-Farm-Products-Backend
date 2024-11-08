<<<<<<< HEAD
export class Payment {}
=======
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  payment_Id: number;

  @Column()
  customer_id: number;

  @Column()
  seller_id: number;

  @Column()
  customer_email: string;

  @Column()
  amount: number;

  @Column()
  quantityBought: string;

  @Column()
  date: Date;

  @Column()
  status:Boolean
}
>>>>>>> 0f1282c28758dcdb20a9b53b2bfc44f058febfc2
