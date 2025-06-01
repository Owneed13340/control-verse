import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GatewayGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('Gateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.server.emit('playerJoined', { id: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.server.emit('playerLeft', { id: client.id });
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    this.logger.log(`Ping from ${client.id}`);
    client.emit('pong', { message: 'pong', received: data });
  }
}
