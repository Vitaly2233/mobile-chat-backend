import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../users/guard/jwt-auth-guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Message')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  createMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.handleCreate(dto);
  }

  @Get('user/:userId')
  getMessages(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
  ) {
    return this.messagesService.getMessages(userId, req.user);
  }

  @Sse('stream/:token')
  connectStream(@Param('token') token: string) {
    return this.messagesService.connectStream(token);
  }
}
