import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { AppConfig } from "src/config/app-config.service";

@Injectable()
export class MailService {
    private transporter = nodemailer.Transporter;
    constructor(
        private readonly appConfig: AppConfig,
    ) {
        this.transporter = nodemailer.createTransport({
            host: appConfig.SMTP_HOST,
            port: appConfig.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: appConfig.SMTP_USER,
                pass: appConfig.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        })
    }

    async sendMail(to: string, subject: string, html: string) {
        await this.transporter.sendMail({
            from: `"My App" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
    }
}