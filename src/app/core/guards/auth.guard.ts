import {CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import {ConfigService} from '@nestjs/config';
import {DatabaseRepository} from '@shared/repositories/database.repository';
import {SchemaConstants} from '@core/constants/schema-constants';
import {UserRole} from '@features/user/entity/user.entity';

interface JWTPayload {
  userId: string;
  userName: string;
  userRole: UserRole; // Add userRole to the payload interface
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly databaseRepository: DatabaseRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing or malformed.');
    }

    try {
      const payload = this.verifyToken(token);

      // Fetch the user from the database using the userId from the token
      const user = await this.databaseRepository.selectWithAndOne(SchemaConstants.USER, {
        userId: payload.userId,
      });

      if (!user) {
        throw new UnauthorizedException('User associated with this token does not exist.');
      }

      // If roles are specified for the route, check if the user's role matches any of them
      if (requiredRoles && !requiredRoles.includes(payload.userRole)) {
        throw new ForbiddenException('You do not have the required permissions to access this resource.');
      }

      // Attach the user and role information to the request object for further use in the controller
      request.user = {
        userId: payload.userId,
        userName: payload.userName,
        userRole: payload.userRole,
      };

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Authorization token has expired. Please log in again.');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token. Please log in again.');
      } else if (error instanceof ForbiddenException) {
        throw error; // Re-throw the ForbiddenException if it's already caught
      } else {
        throw new UnauthorizedException('Failed to authenticate token.');
      }
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const [bearer, token] = authHeader.split(' ');
      return bearer === 'Bearer' ? token : null;
    }

    const xAccessTokenHeader = request.headers['x-access-token'];
    if (xAccessTokenHeader) {
      const [bearer, token] = xAccessTokenHeader.split(' ');
      return bearer === 'Bearer' ? token : null;
    }

    return null;
  }

  private verifyToken(token: string): JWTPayload {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new UnauthorizedException('JWT secret is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret);
    if (typeof decoded === 'object' && 'userId' in decoded && 'userRole' in decoded) {
      return decoded as JWTPayload;
    } else {
      throw new UnauthorizedException('Invalid token structure');
    }
  }
}
