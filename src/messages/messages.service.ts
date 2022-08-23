import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { interval, map, Observable, Subscriber } from 'rxjs';
import { Repository } from 'typeorm';
import { EntityService } from '../common/asbstract/entity-service.abstract';
import { User } from '../users/entity/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entity/message.entity';

@Injectable()
export class MessagesService
  extends EntityService<Message>
  implements OnModuleInit
{
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    private readonly jwtService: JwtService,
  ) {
    super(messageRepository);
  }

  observer: Observable<unknown>;
  subscription: Subscriber<unknown>;

  async onModuleInit() {
    this.observer = new Observable((subscriber) => {
      this.subscription = subscriber;
    });
  }

  async connectStream(token: string) {
    let payload;
    try {
      payload = await this.jwtService.verify(token);
    } catch (e) {
      throw new ForbiddenException(e.message);
    }

    return this.observer.pipe(map((data) => ({ data: data[payload._id] })));
  }

  streamMessage(userId: string, data: any) {
    this.subscription?.next({ [userId]: data });
  }

  async handleCreate(dto: CreateMessageDto) {
    const messageSaved = await this.messageRepository.save(dto);
    const message = await this.messageRepository.findOne({
      where: { id: messageSaved.id },
      relations: ['from', 'to'],
    });
    const to = message.to as User;
    this.streamMessage(to.id.toString(), message);
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
