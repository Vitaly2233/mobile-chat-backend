import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Sse,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../users/guard/jwt-auth-guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { UploadImageDto } from './dto/upload-image.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
@ApiTags('Message')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  createMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.handleCreate(dto);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  sendFile(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() dto: UploadImageDto,
  ) {
    if (!file) throw new BadRequestException('image is undefined');
    return this.messagesService.sendImageMessage({ ...dto, file });
  }

  @Get('user/:userId')
  getMessages(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
  ) {
    return this.messagesService.getMessages(userId, req.user);
  }
}
