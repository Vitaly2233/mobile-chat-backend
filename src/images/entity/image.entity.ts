import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from '../../messages/entity/message.entity';
import { EImageType } from '../enum/image-type.enum';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contentType: string;

  @Column({ enum: EImageType })
  type: EImageType;

  @OneToOne(() => Message, { nullable: true })
  @JoinColumn()
  message?: Message | number;
}
