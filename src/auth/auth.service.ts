import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer'
import { user_login, user_registr } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/uset.table';
import { Repository } from 'typeorm';
import { argon2d, argon2i, argon2id, hash, verify } from 'argon2';
import * as fs from 'fs/promises'
import * as path from 'path'
import { nanoid } from 'nanoid';
import { RedisClientType } from 'redis';
import { Response } from 'express';




@Injectable()
export class AuthService {
    constructor(
        @Inject('nodemailer') private readonly nodemailer: Transporter,
        @InjectRepository(User) private Table_User: Repository<User>,
        @Inject('CONNECTED_REDIS') private readonly redis: RedisClientType,
    ){}

    async registration_verify_email(user_info: user_registr,res:Response){
        const checking_for_re_registration = await this.Table_User.createQueryBuilder('u')
        .select(['u.name','u.email'])
        .where('u.name = :name OR u.email = :email',{name: user_info.name, email: user_info.email})
        .getOne()

        if(checking_for_re_registration?.name){
            return false
        }


        const token = nanoid(24)
        const mail_html = await fs.readFile(path.join(__dirname, '..', '..', 'template', 'mail_template.ejs'), 'utf8')
        const ready_mail = mail_html.replace(/%%TOKEN%%/g, token)

        const hash_password = await hash(user_info.password,{
            type: argon2id,
            memoryCost: 65536,
            parallelism:4,
            timeCost:3,
        })

        const user_data = {
            name: user_info.name,
            password: hash_password,
            email: user_info.email
        }

        await this.redis.HSET(`unverified_registration:${token}`, 'name', user_data.name)
        await this.redis.HSET(`unverified_registration:${token}`, 'email', user_data.email)
        await this.redis.HSET(`unverified_registration:${token}`, 'password', user_data.password)
        await this.redis.expire(`unverified_registration:${token}`,300)

        const sended_mail = await this.nodemailer.sendMail({
            from: '"Chat_auth" <demidplaz@bk.ru>',
            to: user_info.email,
            subject: 'registration',
            text: null,
            html: ready_mail
        })

        res.cookie('registration_token', token, {
            maxAge: 5 * 60 * 1000,
            httpOnly: true,
            secure: true,
          }
        )

        return true

    }


    async verify_registration(token:string,cookie_token,res){
        const user_info = await this.redis.HGETALL(`unverified_registration:${token}`)

        if(user_info && cookie_token == token){
            this.redis.DEL(`unverified_registration:${token}`)

            const checking_for_re_registration = await this.Table_User.createQueryBuilder('u')
            .select(['u.name','u.email'])
            .where('u.name = :name OR u.email = :email',{name: user_info.name, email: user_info.email})
            .getOne()

            if(checking_for_re_registration?.name || checking_for_re_registration?.email){
                return false
            }

            const user_id = nanoid(12)

            const new_user = await this.Table_User.create({
                id: user_id,
                name:user_info.name,
                email: user_info.email,
                password: user_info.password
            })

            await this.Table_User.save(new_user)

            res.clearCookie('registration_token');
            res.cookie('user_id',user_id,{
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
              })

            return {
                email:user_info.email,
                name: user_info.name
            }
        }

        return false
    }

    async arleady_send_mail(token,email){
        
        const mail_html = await fs.readFile(path.join(__dirname, '..', '..', 'template', 'mail_template.ejs'), 'utf8')
        const ready_mail = mail_html.replace(/%%TOKEN%%/g, token)
        
        const sended_mail = await this.nodemailer.sendMail({
            from: '"Chat_auth" <demidplaz@bk.ru>',
            to: email,
            subject: 'registration',
            text: null,
            html: ready_mail
        })
    }


    async login(user_data:user_login,res:Response){
        const user_search = await this.Table_User.createQueryBuilder('u')
        .select(['u.password','u.id'])
        .where('u.name = :user_or_email OR u.email = :user_or_email',{
            user_or_email:user_data.name_or_email
        })
        .getOne()

        if(!user_search?.id){
            return false
        }

        const matching_passwords = await verify(user_search.password,user_data.password)

        if(matching_passwords){
            res.cookie('user_id',user_search.id ,{
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
              })
              return true
        }
        else{
            return false
        }


    }
}
