import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

interface DecodedToken extends jwt.JwtPayload {
  email: string;
  sub: string;
  roles: string[];
}

@Injectable()
export class WsAuthMiddleware {
  use(socket: Socket, next: (err?: Error) => void) {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.cookie
        ?.split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1];

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    if (!process.env.JWT_SECRET) {
      console.error('Middleware - JWT_SECRET is not defined');
      return next(new Error('Server configuration error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
      socket.data = {
        user: {
          userId: decoded.sub,
          email: decoded.email,
          roles: decoded.roles,
        },
      };
      next();
    } catch (error) {
      return next(new Error('Unauthorized'));
    }
  }
}
