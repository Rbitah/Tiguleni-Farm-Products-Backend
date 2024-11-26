import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from 'src/authentication/entities/authentication.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  profileId: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  name: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
