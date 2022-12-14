import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG } from '../common/config';
import { UsersModule } from '../users/users.module';
import { MessagesGateway } from './messages.gateway';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    JwtModule.register({
      verifyOptions: { ignoreExpiration: true },
      secret: CONFIG.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    UsersModule,
    ImagesModule,
  ],
  providers: [MessagesService, MessagesGateway],
  controllers: [MessagesController],
})
export class MessagesModule {}
