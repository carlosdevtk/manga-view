/* eslint-disable @typescript-eslint/no-namespace */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/user/auth.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const cookie = request.cookies['jwt'] || null;
    if (cookie) {
      const user = await this.authService.getCurrentUser(cookie);
      request.currentUser = user;
    }

    next();
  }
}
