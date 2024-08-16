import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  [x: string]: any;
  constructor(private readonly configService: ConfigService) {}
  generateJWT(payload: any) {
    const jwtSecret = this.configService.get('JWT_SECRET');
    return jwt.sign(payload, jwtSecret, {
      expiresIn: '60d',
    });
  }
}
