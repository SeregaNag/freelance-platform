import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { Injectable } from "@nestjs/common";


@Injectable()
export class WsAuthMiddleware {
    use(socket: Socket, next: (err?: Error) => void) {
        const token = socket.handshake.auth.token || 
                     socket.handshake.headers.cookie?.split('; ')
                        .find(row => row.startsWith('access_token='))?.split('=')[1];
        
        console.log('Middleware - Auth token:', token);
        console.log('Middleware - Cookies:', socket.handshake.headers.cookie);
        
        if (!token) {
            console.log('Middleware - No token found');
            return next(new Error("Unauthorized"));
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            console.log('Middleware - Token decoded:', decoded);
            socket.data.user = decoded;
            next();
        } catch (error) {
            console.log('Middleware - Token verification failed:', error);
            return next(new Error("Unauthorized"));
        }
    }
}
