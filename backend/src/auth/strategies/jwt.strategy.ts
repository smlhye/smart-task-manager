import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AppConfig } from "src/config/app-config.service";
import { TokenPayload } from "../services/token.service";

export interface CurrentUserPayload {
    userId: number;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly config: AppConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.JWT_SECRET,
        })
    }
    async validate(payload: TokenPayload) : Promise<CurrentUserPayload> {
        return {
            userId: payload.sub,
            email: payload.email,
        }
    }
}