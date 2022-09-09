import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';

export class UploadImageDto extends PickType(CreateMessageDto, ['from', 'to']) {
  @ApiProperty({ format: 'binary', type: 'string' })
  file: Express.Multer.File;
}
