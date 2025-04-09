import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { Injectable } from "@nestjs/common";


@Injectable()
export class WsAuthMiddleware {
    use(socket: Socket, next: (err?: Error) => void) {
            const token = socket.handshake.auth.token ||  socket.handshake.headers.cookie?.split('=')[1];
            if (!token) return next(new Error("Unauthorized"));
        
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
                socket.data.user = decoded;
                next();
            } catch (error) {
                return next(new Error("Unauthorized"));
            }
    }
}
