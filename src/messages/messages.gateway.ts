import { forwardRef, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
  ) {}
  handleDisconnect(client: any) {
    console.log('disconnected', client.id);
    const connectedClient = Object.keys(
      this.messagesService.activeConnected,
    ).find((key) => this.messagesService.activeConnected[key] === client.id);
    delete this.messagesService.activeConnected[connectedClient];
  }

  @WebSocketServer()
  server: Server;

  async handleConnection(client: any) {
    try {
      const token = client?.handshake?.headers?.token;
      console.log('connected', client.id);

      if (!token) client.disconnect();

      const payload = await this.jwtService.verify(token);

      if (this.messagesService.activeConnected[payload.id])
        delete this.messagesService.activeConnected[payload.id];

      this.messagesService.activeConnected[payload.id] = client.id;
    } catch (e) {
      client.disconnect();
    }
  }
}
