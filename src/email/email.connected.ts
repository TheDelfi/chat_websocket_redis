import * as nodemailer from 'nodemailer';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';




export const nodeMailerProvider: Provider = {
    provide: 'nodemailer',
    inject: [ConfigService],

    useFactory: async(config_service: ConfigService)=>{
        const transporter = nodemailer.createTransport({
            host: config_service.get<string>('NM_HOST'),
            port: config_service.get<number>('NM_PORT'),
            secure: false,
            auth: {
                user: config_service.get<string>('NM_USER'),
                pass: config_service.get<string>('NM_PASS'),
            }
        })
        return transporter
    }
}