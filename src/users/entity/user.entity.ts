import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Message } from '../../messages/entity/message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Message, (message) => message.from)
  messagesFrom: Message[];

  @OneToMany(() => Message, (message) => message.to)
  messagesTo: Message[];
}
