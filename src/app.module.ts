import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import * as path from 'path';
import { User } from '../entities/uset.table';


@Module({
  imports: [
    RedisModule,
    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '..', '.env')
    }),
    
    TypeOrmModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: async(config_service: ConfigService)=>({
          type: 'postgres',
          host: config_service.get<string>('DB_HOST'),
          port: config_service.get<number>('DB_PORT'),
          username: config_service.get<string>('DB_USERNAME'),
          password: config_service.get<string>('DB_PASSWORD'),
          database: config_service.get<string>('DB_DATABASE'),
          entities: [User],
          synchronize: true,
        }),
        inject: [ConfigService]
      }
    ),
    
    EmailModule,
    
    AuthModule,

  ],
})
export class AppModule {}
