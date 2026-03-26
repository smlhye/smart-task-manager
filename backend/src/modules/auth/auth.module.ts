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
import { RevokedTokenCleanupService } from "./services/revoked-token-cleanup.service";
import { RevokedTokenRepository } from "./repositories/revoked-token.repository";
import { UserRepository } from "../user/repositories/user.repository";

@Module({
    imports: [PrismaModule],
    providers: [AuthService, UserRepository, JwtService, TokenService, AppConfig, SessionRepository, SessionCleanupService, JwtStrategy, RevokedTokenCleanupService, RevokedTokenRepository],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }