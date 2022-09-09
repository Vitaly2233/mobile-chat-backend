import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  text?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => User, (user) => user.messagesFrom, { cascade: true })
  @JoinColumn()
  from: User | number;

  @ManyToOne(() => User, (user) => user.messagesTo, { cascade: true })
  @JoinColumn()
  to: User | number;
}
