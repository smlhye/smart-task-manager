import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { parseToSeconds } from "src/common/utils/time.utils";
import { AppConfig } from "src/config/app-config.service";
import { StringValue } from "ms";

export interface TokenPayload {
    sub: number;
    email: string;
}

@Injectable()
export class TokenService {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: AppConfig
    ) { }

    generateAccessToken(payload: TokenPayload) {
        return this.jwt.sign(payload, {
            secret: this.config.JWT_SECRET,
            expiresIn: this.config.JWT_EXPIRATION as JwtSignOptions["expiresIn"],
        });
    }

    generateRefreshToken(payload: TokenPayload) {
        return this.jwt.sign(payload, {
            secret: this.config.JWT_REFRESH_SECRET,
            expiresIn: this.config.JWT_REFRESH_EXPIRATION as JwtSignOptions["expiresIn"],
        });
    }

    getAccessTokenExpiresIn(): number {
        return parseToSeconds(this.config.JWT_EXPIRATION as StringValue);
    }

    getRefreshTokenExpiresIn(): number {
        return parseToSeconds(this.config.JWT_REFRESH_EXPIRATION as StringValue);
    }
}