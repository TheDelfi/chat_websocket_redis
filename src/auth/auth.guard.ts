import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req:Request = context.switchToHttp().getRequest()
    const res:Response = context.switchToHttp().getResponse()
    const user_id = req.cookies['user_id']
    const authRoute = req.originalUrl.startsWith('/auth')

    if(user_id && authRoute){
      res.redirect('/')
      return false
    }
    else{
      return true;
    }
  }
}
