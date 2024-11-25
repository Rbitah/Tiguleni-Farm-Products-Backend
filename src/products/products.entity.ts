import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from "src/authentication/entities/authentication.entity";

@Entity()
export class Products {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Column()
  products_name: string;

  @Column('decimal')
  price: number;

  @Column()
  location: string;

  @Column('int')
  quantity_amount: number;

  @Column()
  quantity_metric: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.products)
  seller: User;
}
