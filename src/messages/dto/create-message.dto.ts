import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNumber } from '../../common/decorators/is-number.decorator';
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
