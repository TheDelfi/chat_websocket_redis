import { Body, Controller, Get, Post, Query, Redirect, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { user_login, user_registr } from './user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';


@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('registration')
  @Render('registration')
  async get_registr_page(@Req() req: Request,@Res() res:Response){
    return {}
  }


  @Post('registration')
  async post_user_registration(@Body() user_info: user_registr, @Res() res: Response) {
    
    const save_user_data = await this.authService.registration_verify_email(user_info,res);

    if(save_user_data == true){
      res.redirect(`/auth/registration/waiting_for_verification?email=${user_info.email}`);
    }
    else{
      res.redirect('/auth/registration');
    }
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
  async get_login_page(@Res() res:Response){
    return {}
  }


  @Post('login')
  async login_request(@Body() user_data: user_login, @Res() res:Response){
    const login_result = await this.authService.login(user_data, res)
    if(login_result){
      res.redirect('/')
    }
    else{
      res.redirect('/auth/login')
    }

  }
}
