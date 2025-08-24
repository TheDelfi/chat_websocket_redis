import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { nodeMailerProvider } from './email.connected';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [EmailController],
  providers: [
    EmailService,
    nodeMailerProvider,
  ],
})
export class EmailModule {}
