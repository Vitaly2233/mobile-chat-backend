import {
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
import { UploadFileDto } from './dto/upload-file.dto';
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

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  sendFile(
    @Body() dto: UploadFileDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    console.log(file, dto);
  }

  @Get('user/:userId')
  getMessages(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
  ) {
    return this.messagesService.getMessages(userId, req.user);
  }
}
