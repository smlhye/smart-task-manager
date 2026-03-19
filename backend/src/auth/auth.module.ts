import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthRepository } from "./repositories/auth.repository";
import { TokenService } from "./services/token.service";
import { JwtService } from "@nestjs/jwt";
import { AppConfig } from "src/config/app-config.service";
import { SessionRepository } from "./repositories/session.repository";
import { SessionCleanupService } from "./services/session-cleanup.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [PrismaModule],
    providers: [AuthService, AuthRepository, JwtService, TokenService, AppConfig, SessionRepository, SessionCleanupService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }