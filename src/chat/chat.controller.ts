import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('chat')
export class ChatController {

    @Get()
    @Render('chat')
    async chat_page(@Res() res:Response){
        res.clearCookie('user_id')
        return {}
    }
}
