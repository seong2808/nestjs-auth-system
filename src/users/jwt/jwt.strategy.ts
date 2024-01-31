import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.payload';
import { UsersService } from '../services/users.service';
import { jwtExtractorFromCookies } from 'src/common/utils/jwtExtractorFromCookies';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractorFromCookies]),
      secretOrKey: process.env.SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    try {
      const user = await this.usersService.findUserById(payload.sub);
      if (user) {
        return user;
      } else {
        throw new Error('해당하는 유저는 없습니다.');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
