import { PickType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { User } from '../entity/user.entity';

export class CreateUserDto extends PickType(User, [
  'firstName',
  'lastName',
  'username',
]) {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  username: string;
}
