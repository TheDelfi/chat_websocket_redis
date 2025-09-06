import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('chat')
export class ChatController {

    @Get()
    @Render('chat')
    async chat_page(@Req() req:Request){
        console.log(req.cookies['user_id'])
        return {}
    }
}
