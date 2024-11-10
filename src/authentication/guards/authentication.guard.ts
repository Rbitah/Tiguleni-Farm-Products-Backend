import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractAccessToken(request);
    if (!token) {
      throw new UnauthorizedException('invalid token');
    }
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      request.userId = payload.userId;
      //request.role = payload.role
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException('invalid token');
    }
    return true;
  }

  private extractAccessToken(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
