import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config_service = app.get(ConfigService)
  
  const port = config_service.get<number>('port')
  
  if(port){
    await app.listen(port);
  }
  
}
bootstrap();
