import { User } from 'src/authentication/entities/authentication.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Sales {
  @PrimaryGeneratedColumn('uuid')
  sales_Id: string;

  @Column()
  amount: number;

  @Column()
  productType:string

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sale)
  @JoinColumn()
  seller: User;
}
