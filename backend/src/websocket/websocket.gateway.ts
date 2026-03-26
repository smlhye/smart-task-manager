import { Injectable } from "@nestjs/common";
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationItemSuccess } from "src/modules/notification/dto/response.dto";

@Injectable()
@WebSocketGateway({
    namespace: '/socket',
    cors: {
        origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
        methods: ['GET', 'POST'],
        credentials: true,
    }
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    afterInit() {
        console.log('WebSocket initialized on namespace /socket');
    }

    handleConnection(client: Socket) {
        const userId = Number(client.handshake.query.userId);
        if (!isNaN(userId)) {
            client.join(`user-${userId}`);
            console.log(`Client ${client.id} joined room user-${userId}`);
        } else {
            console.log(`Client ${client.id} connected but no valid userId`);
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }
    
    emitNotification(userId: number, payload: NotificationItemSuccess) {
        console.log(`Emitting notification to user-${userId}`, payload);
        this.server.to(`user-${userId}`).emit('notification', payload);
    }
}