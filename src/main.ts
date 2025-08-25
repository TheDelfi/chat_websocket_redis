import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as path from 'path'
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config_service = app.get(ConfigService)


  app.use(cookieParser())
  app.useStaticAssets(path.join(__dirname, '..', 'static'),{
    prefix:'/static'
  });  
  app.setBaseViewsDir(path.join(__dirname,'..','template'))
  app.setViewEngine('ejs')
  
  const port = config_service.get<number>('port')
  
  if(port){
    await app.listen(port);
  }
  
}
bootstrap();
