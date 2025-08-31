import { Inject, Injectable, Req, Res, OnApplicationBootstrap } from '@nestjs/common';
import { Request, Response } from 'express';
import { RedisClientType } from 'redis';
import { getUnixTime } from 'date-fns';
import { nanoid } from 'nanoid';
import { th, tr } from 'date-fns/locale';



@Injectable()
export class QueueService {
    constructor(
        @Inject('CONNECTED_REDIS') private readonly redis: RedisClientType
    ){}

    OnApplicationBootstrap(){
        setInterval(()=>{
            this.clearing_the_queue_of_old_users()
        }, 120000)
    }


    async user_selection(req:Request, res:Response){

        
        const user_id =  req.cookies['user_id'] // nanoid(8)
        const unixtime = getUnixTime(new Date())

        // проверка на вход в очередь повторно
        const checking_the_repeat_search = await this.redis.ZRANK('queue', user_id)
        
        if(checking_the_repeat_search){
            return false
        }

        await this.redis.ZADD('queue', {
            score: unixtime,
            value: user_id
        })

        let timeExpired = 0

        return new Promise(async(res,rej)=>{
            const checking_the_queue = setInterval(async () => {
                
                timeExpired += 2
                if(timeExpired >= 60){
                    await this.redis.ZREM('queue', user_id)
                    
                    res(false)
                    clearInterval(checking_the_queue)
                }
    

                const your_position_in_the_queue = await this.redis.ZRANK('queue', user_id)            
                if(your_position_in_the_queue == 0){
                    
                    const interlocutor_id = await this.redis.ZRANGE('queue', 1,1)
                    if(interlocutor_id[0]){
                        const chatID = nanoid(8)
                    
                        // передал второму пользователю айди чата
                        await this.redis.SET(`chatID:${interlocutor_id[0]}`,chatID)

                        // удалил пользователей из очереди
                        await this.redis.ZREM('queue', interlocutor_id[0])
                        await this.redis.ZREM('queue', user_id)
                        
                        // айди тех кто состоит в этом чате
                        await this.redis.LPUSH(`chatINFO:${chatID}`, user_id)
                        await this.redis.LPUSH(`chatINFO:${chatID}`, interlocutor_id)
    
                        res(chatID)
                        clearInterval(checking_the_queue)
                    }
                }
                else if(!your_position_in_the_queue){
                    // второй юзер получил айди чата
                    const chatID = await this.redis.GET(`chatID:${user_id}`)
                    
                    if(chatID){
                        await this.redis.DEL(`chatID:${user_id}`)
                        res(chatID)
                    }
                    else{
                        res(false)
                    }
                    
                    clearInterval(checking_the_queue)
                }
            }, 2000);
        })
        
    }


    clearing_the_queue_of_old_users(){
        const expiredTime = Number(getUnixTime(new Date())) - 60
        this.redis.ZREMRANGEBYSCORE('queue', 0, expiredTime)
    }
}
