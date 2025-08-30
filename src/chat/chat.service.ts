import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { Socket } from 'socket.io';
import * as cookie from 'cookie';


@Injectable()
export class ChatService {
    constructor(
        @Inject('CONNECTED_REDIS') private readonly redis: RedisClientType
    ){}


    async user_verification(chatID:string, user_id:string){
        const users_ids_in_chat = await this.redis.LRANGE(`chatINFO:${chatID}`, 0,1)
        if(users_ids_in_chat.includes(user_id)){
            return true
        }
        else{
            return false
        }
    }



    async websocket_connect(client:Socket){
        const cookies = client.handshake.headers.cookie
        const chatID = String(client.handshake.query.chatID)
    
        const all_user_rooms = Array.from(client.rooms).slice(1)
        for(let i of all_user_rooms){
            client.leave(i)
        }

        if(cookies && chatID){
          const all_cookies = cookie.parse(cookies)
          const user_id = all_cookies['user_id']
          
          if(user_id){
            //Array.from(client.rooms).slice(1)
            // проверка на наличие этого пользователя в чате
            const verification = await this.user_verification(chatID,user_id)
            if(verification){
                console.log('verifed')
                client.join(chatID)
            } 
            else{
                console.log('not verifed')
                client.disconnect(true)
            }
          }
        }
    }
}
