import { HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AppConfig } from "src/config/app-config.service";
import { TokenPayload } from "../services/token.service";
import { RevokedTokenRepository } from "../repositories/revoked-token.repository";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import { createHash } from "crypto";
import { Request } from "express";

export interface CurrentUserPayload {
    userId: number;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly config: AppConfig,
        private readonly revokedTokenRepo: RevokedTokenRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    if (req && req.cookies) {
                        return req.cookies["access_token"]
                    }
                    return null
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: config.JWT_SECRET,
            passReqToCallback: true,
        })
    }

    async validate(req: Request, payload: TokenPayload): Promise<CurrentUserPayload> {
        const token = req?.cookies?.['access_token'];
        if (!token) throw new BaseException({
            code: ErrorCode.AUTH_INVALID_TOKEN,
            message: 'No token provided',
            status: HttpStatus.UNAUTHORIZED,
        })
        const hashedToken = createHash('sha256').update(token).digest('hex');
        const hashedTokenExisted = await this.revokedTokenRepo.findByToken(hashedToken);
        if (hashedTokenExisted?.revoked) {
            req.res?.clearCookie('access_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            throw new BaseException({
                code: ErrorCode.AUTH_INVALID_TOKEN,
                message: 'Token revoked',
                status: HttpStatus.UNAUTHORIZED,
            })
        }
        return {
            userId: payload.sub,
            email: payload.email,
        }
    }
}