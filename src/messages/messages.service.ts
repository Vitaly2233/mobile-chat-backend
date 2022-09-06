import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityService } from '../common/asbstract/entity-service.abstract';
import { User } from '../users/entity/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entity/message.entity';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class MessagesService extends EntityService<Message> {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @Inject(forwardRef(() => MessagesGateway))
    private readonly messagesGateway: MessagesGateway,
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
