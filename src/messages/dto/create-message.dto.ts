import { PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Message } from '../entity/message.entity';

export class CreateMessageDto extends PickType(Message, [
  'from',
  'to',
  'text',
]) {
  @IsString()
  text: string;

  @IsNumber()
  to: number;

  @IsNumber()
  from: number;
}
