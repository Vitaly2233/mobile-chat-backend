import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityService } from '../common/abstract/entity-service.abstract';
import { JwtPayload } from '../common/interface/jwt-payload.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService extends EntityService<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    super(userRepository);
  }

  async handleCreate(dto: CreateUserDto) {
    let user = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (!user) user = await this.userRepository.save(dto);

    const payload: JwtPayload = { id: user.id };

    return this.jwtService.sign(payload);
  }

  async getChats() {
    const users = await this.findMany();

    return users.map((user) => {
      return { ...user, lastMessage: 'some message', unread: 0 };
    });
  }
}
