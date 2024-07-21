import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { User } from '@prisma/client';
import { ERROR_MESSAGES } from '../errors';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
    
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log(request.body,"SDsdf")
          return request.body?.refreshToken
        },
      ]),
      secretOrKey: config.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: User) {
    const refreshToken = req?.body?.refreshToken;
    if (!refreshToken) {
      throw new NotFoundException(ERROR_MESSAGES.MISSING_REFRESH_TOKEN);
    }
    return {
      ...payload,
      refreshToken,
    };
  }
}
