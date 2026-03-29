import { Module } from "@nestjs/common";
import { MailService } from "./service/mail.service";
import { AppConfig } from "src/config/app-config.service";

@Module({
    imports: [],
    providers: [MailService, AppConfig],
    exports: [MailService],
})
export class MailModule {}