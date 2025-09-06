import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as path from 'path'
import * as cookieParser from 'cookie-parser';
import { WebSocket } from 'http';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config_service = app.get(ConfigService)


  app.use(cookieParser())

  app.useStaticAssets(path.join(process.cwd(), 'static'),{
    prefix:'/static'
  });  
  app.setBaseViewsDir(path.join(process.cwd(),'template'))
  app.setViewEngine('ejs')
  
  await app.listen(3000);
  console.log('Nest application successfully started on port 3000');
  
}
bootstrap();
