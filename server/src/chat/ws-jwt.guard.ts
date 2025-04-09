import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class WsJwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const client = context.switchToWs().getClient();
        console.log('Guard - Client data:', client.data);
        console.log('Guard - Client user:', client.data.user);
        return !!client.data.user;
    }
}
