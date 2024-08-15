import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class UserIdentificationMiddleware implements NestMiddleware {
  private readonly cookieName = 'inventory_user_id';

  use(req: Request, res: Response, next: NextFunction) {
    // Prioritize X-User-ID header
    let userId = req.header('X-User-ID') || req.cookies[this.cookieName];

    if (!userId) {
      userId = this.generateUserId();
      res.cookie(this.cookieName, userId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    }

    // Always set the cookie to ensure consistency
    res.cookie(this.cookieName, userId, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    req['userId'] = userId;
    next();
  }

  private generateUserId(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
