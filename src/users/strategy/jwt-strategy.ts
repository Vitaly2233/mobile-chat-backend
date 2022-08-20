import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CONFIG } from '../../common/config';
import { JwtPayload } from '../../common/interface/jwt-payload.interface';
import { UsersService } from '../users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: CONFIG.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return this.userService.findOne({ where: { id: payload.id } });
  }
}
