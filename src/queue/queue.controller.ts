import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { QueueService } from './queue.service';
import { Request, Response } from 'express';



@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get()
  @Render('queue')
  queue_page(){
    return {}
  }

  @Post('search')
  async queue_search(@Req() req:Request, @Res() res:Response){
    const search_chat = await this.queueService.user_selection(req,res)

    if(search_chat){
      res.redirect(`/chat?chatID=${search_chat}`)
    }

    else{
      res.json({ status: 'error' })
    }

    
  }
}
