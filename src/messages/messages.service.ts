import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityService } from '../common/abstract/entity-service.abstract';
import { EImageType } from '../images/enum/image-type.enum';
import { ImagesService } from '../images/images.service';
import { User } from '../users/entity/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UploadImageDto } from './dto/upload-image.dto';
import { Message } from './entity/message.entity';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class MessagesService extends EntityService<Message> {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @Inject(forwardRef(() => MessagesGateway))
    private readonly messagesGateway: MessagesGateway,

    private readonly imagesService: ImagesService,
  ) {
    super(messageRepository);
  }

  activeConnected: any = {};

  async sendWebsocketMessage(userId: string, message: Message) {
    const socketId = this.activeConnected[userId.toString()];
    if (socketId)
      this.messagesGateway.server
        .to(this.activeConnected[userId])
        .emit('new-message', message);
  }

  async handleCreate(dto: CreateMessageDto) {
    const messageSaved = await this.messageRepository.save(dto);
    const message = await this.messageRepository.findOne({
      where: { id: messageSaved.id },
      relations: ['from', 'to'],
    });
    const to = message.to as User;
    this.sendWebsocketMessage(to.id.toString(), message);
  }

  async sendImageMessage(dto: UploadImageDto) {
    const message = await this.messageRepository.save(dto);

    const image = await this.imagesService.createImage(
      message.id,
      EImageType.Message,
      dto.file,
    );

    await this.messageRepository.save({
      ...message,
      imageUrl: this.imagesService.createImageUrl(image.id),
    });

    const res = await this.messageRepository.findOne({
      where: { id: message.id },
      relations: ['from', 'to'],
    });
    this.sendWebsocketMessage(dto.to.toString(), res);
    return res;
  }

  async getMessages(userId: number, user: User) {
    if (userId === user.id) return [];

    return this.messageRepository
      .createQueryBuilder('message')
      .where('message.from = :fromMe', { fromMe: user.id })
      .andWhere('message.to = :to', { to: userId })
      .orWhere('message.from = :from', { from: userId })
      .andWhere('message.to = :toMe', { toMe: user.id })
      .innerJoinAndSelect('message.from', 'fromUser')
      .innerJoinAndSelect('message.to', 'toUser')
      .getMany();
  }
}
