import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { Socket } from 'socket.io';
import * as cookie from 'cookie';
import { json } from 'stream/consumers';
import { th } from 'node_modules/date-fns/locale/th.cjs';


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
        const user_id = this.get_user_id(client)
        const chatID = String(client.handshake.query.chatID)
    
        const all_user_rooms = Array.from(client.rooms).slice(1)
        for(let i of all_user_rooms){
            if(i != chatID){
                client.leave(i)
            }
        }

        if(user_id && chatID){
            // проверка на наличие этого пользователя в чате
            const verification = await this.user_verification(chatID,user_id)
            if(verification){
                
                
                if(Array.from(client.rooms)[1] !== chatID){
                    client.join(chatID)
                }

                return true
            } 
            else{
                
                client.disconnect(true)
            }
        }
        return false
    }


    async save_message( message_info: { sender: string, message: string, chatID:string} ){
        await this.redis.LPUSH(`chat:${message_info.chatID}`, JSON.stringify(message_info))
    }

    async get_all_message(chatID){
        const all_mess = await this.redis.LRANGE(`chat:${chatID}`,0, -1)
        return all_mess
    }

    get_user_id(client: Socket){
        const cookies = client.handshake.headers.cookie
        if(cookies){
            const all_cookies = cookie.parse(cookies)
            const user_id = all_cookies['user_id'] //String(client.handshake.query.user_id)
            return user_id
        }
        return false
    }
}
