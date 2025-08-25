import { Body, Controller, Get, Post, Query, Redirect, Render, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { user_registr } from './user.dto';
import { Request, Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('registration')
  @Render('registration')
  async get_registr_page(@Req() req: Request,@Res() res:Response){

    return {}
  }


  @Post('registration')
  async post_user_registration(@Body() user_info: user_registr, @Res() res: Response) {

    const token = await this.authService.registration_verify_email(user_info);
    res.cookie('registration_token', token, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        secure: true,
      }
    )
    res.redirect(`/auth/registration/waiting_for_verification?email=${user_info.email}`);

  }





  @Get('registration/waiting_for_verification')
  @Render('waiting_verify_page')
  registration_waiting_page(@Query('email') email:string,@Req() req: Request, @Res() res:Response){

    if(!req.cookies['registration_token']){
      res.redirect('/')
    }
    
    else{  
      return { email }
    }
  }

  @Post('registration/waiting_for_verification')
  async registration_arleady_send_mail(@Body() body:any ,@Req() req: Request, @Res() res:Response){
    
    await this.authService.arleady_send_mail(req.cookies['registration_token'],body.email)
    
    res.redirect(`/auth/registration/waiting_for_verification?email=${body.email}`);
  }


  @Get('registration/verify')
  @Render('complete_verify')
  async registration_verify_email(@Query('token') token:string,@Res() res:Response, @Req() req:Request){

    const verify_info = await this.authService.verify_registration(token,req.cookies['registration_token'],res)
    return { verify_info }
  }


  @Get('login')
  @Render('login')
  async get_login_page(){
    return {}
  }
}
