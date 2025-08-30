import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';


@WebSocketGateway({
  namespace: '/chat',
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {
  }

  @WebSocketServer() Server: Server


  async handleConnection(client: Socket){
    await this.chatService.websocket_connect(client)
  }

  async handleDisconnect(){}
}
