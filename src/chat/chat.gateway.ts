import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';
import { th } from 'date-fns/locale';


@WebSocketGateway({
  namespace: '/chat',
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {
  }

  @WebSocketServer() Server: Server


  async handleConnection(client: Socket){
    const verification = await this.chatService.websocket_connect(client)
    

    if(verification){
      const chatID = Array.from(client.rooms)[1]
      const all_message = await this.chatService.get_all_message(chatID)

      const user_id = this.chatService.get_user_id(client)
      client.emit('get_all_message',{all_message, user_id})
    }
  }

  async handleDisconnect(client:Socket){
    const user_rooms = Array.from(client.rooms).slice(1)
    
    for(let i of user_rooms){
      client.leave(i)
    }

  }

  @SubscribeMessage('send_message_server')
  async send_message(
    @MessageBody() message: {message_text: string}, 
    @ConnectedSocket() client:Socket
  ){
    const chatID = Array.from(client.rooms)[1]
    const user_id = this.chatService.get_user_id(client)

    
    if(user_id){
      
      const information_about_the_sent_email = {
        sender: user_id,
        message: message.message_text,
        chatID: chatID
      }
      await this.chatService.save_message(information_about_the_sent_email)
      this.Server.to(chatID).emit('send_message',information_about_the_sent_email)
    }
    else{
      client.emit('error')
    }
  }


  @SubscribeMessage('get_userID')
  get_user_id(@ConnectedSocket() client:Socket){
    const user_id = this.chatService.get_user_id(client)
    client.emit('get_userID', user_id)
  }
}
