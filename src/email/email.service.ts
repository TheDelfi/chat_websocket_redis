import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer'

@Injectable()
export class EmailService {
    constructor(
        @Inject('nodemailer') private readonly transporter: Transporter,
    ){}

}
