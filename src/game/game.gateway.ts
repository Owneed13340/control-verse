import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // TODO: sécuriser en production
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connecté : ${client.id}`);
    client.emit('connected', { message: 'Bienvenue sur ControlVerse !' });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté : ${client.id}`);
  }

  @SubscribeMessage('join-race')
  handleJoinRace(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log(`Client ${client.id} rejoint la course avec données :`, data);

    // Broadcast aux autres clients
    client.broadcast.emit('player-joined', {
      playerId: client.id,
      ...data,
    });
  }

  @SubscribeMessage('car-control')
  handleCarControl(@MessageBody() command: any, @ConnectedSocket() client: Socket) {
    console.log(`Commande du joueur ${client.id} :`, command);

    // Relais à Unity ou à la voiture RC via un autre service
    this.server.emit('car-command', {
      playerId: client.id,
      command,
    });
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('✅ Ping reçu de', client.id, '>', data);
    client.emit('pong', {
      message: 'pong',
      receivedAt: Date.now(),
    });
  }
}
