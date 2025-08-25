import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/uset.table';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports:[
    RedisModule,
    EmailModule,
    TypeOrmModule.forFeature([
      User
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
