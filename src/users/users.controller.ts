import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth-guard';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.handleCreate(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMe(@Req() req: Request) {
    return req.user;
  }

  @Get('chats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getChats() {
    return this.userService.getChats();
  }
}
