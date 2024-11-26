import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from "src/authentication/entities/authentication.entity";
import { Feedback } from 'src/ratesandreviews/entities/ratesandreview.entity';

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

  @Column()
  category: string;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'sellerUserId' }) 
  seller: User;

  @OneToMany(() => Feedback, (feedback) => feedback.product)
  feedback: Feedback[];  
}
