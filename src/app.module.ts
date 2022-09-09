import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';

import { Message } from './messages/entity/message.entity';
import { User } from './users/entity/user.entity';
import { ImagesModule } from './images/images.module';
import { Image } from './images/entity/image.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'chat-app',
      //TODO better to remove
      synchronize: true,
      entities: [User, Message, Image],
      subscribers: [],
      migrations: [],
      retryAttempts: 1,
      retryDelay: 100,
    }),
    MessagesModule,
    UsersModule,
    ImagesModule,
  ],
})
export class AppModule {}
