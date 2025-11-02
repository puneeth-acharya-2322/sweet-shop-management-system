// backend/src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserRole } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  // This method runs AFTER NestJS verifies the token's signature
  async validate(payload: { sub: string; username: string; role: UserRole }) { // <-- ADD ROLE HERE
  // 'payload' is the decoded object we put in the token
  const user = await this.userModel.findById(payload.sub);

  if (!user) {
    throw new UnauthorizedException();
  }

    // We can trust the role from the payload, since the payload
  // itself is verified by the JWT signature.
  // This is faster than re-fetching the user.
  return { _id: payload.sub, username: payload.username, role: payload.role };
  }
}