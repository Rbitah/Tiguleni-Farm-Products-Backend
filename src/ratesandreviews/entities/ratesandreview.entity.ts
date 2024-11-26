
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/authentication/entities/authentication.entity';
import { Products } from 'src/products/products.entity';
@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  feedbackId: string;

  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  productId: string;

  @Column()
  username: string;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Products, (product) => product.feedback)  
  @JoinColumn({ name: 'productId' })
  product: Products;
}

