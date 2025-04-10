import { Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import { Injectable } from "@nestjs/common";

interface DecodedToken extends jwt.JwtPayload {
    email: string;
    sub: string;
    roles: string[];
}

@Injectable()
export class WsAuthMiddleware {
    use(socket: Socket, next: (err?: Error) => void) {
        console.log('Middleware - Handshake headers:', socket.handshake.headers);
        console.log('Middleware - Handshake cookies:', socket.handshake.headers.cookie);
        
        const token = socket.handshake.auth.token || 
                     socket.handshake.headers.cookie?.split('; ')
                        .find(row => row.startsWith('access_token='))?.split('=')[1];
        
        console.log('Middleware - Extracted token:', token);
        
        if (!token) {
            console.log('Middleware - No token found');
            return next(new Error("Unauthorized"));
        }

        if (!process.env.JWT_SECRET) {
            console.error('Middleware - JWT_SECRET is not defined');
            return next(new Error("Server configuration error"));
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
            console.log('Middleware - Token decoded:', decoded);
            socket.data = {
                user: {
                    userId: decoded.sub,
                    email: decoded.email,
                    roles: decoded.roles
                }
            };
            console.log('Middleware - Socket data after setting:', socket.data);
            next();
        } catch (error) {
            console.log('Middleware - Token verification failed:', error);
            return next(new Error("Unauthorized"));
        }
    }
}
