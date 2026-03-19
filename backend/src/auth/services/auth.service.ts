import { HttpStatus, Injectable } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import * as bcrypt from 'bcryptjs';
import { mapDtoToUser } from "../auth.mapper";
import { TokenService } from "./token.service";
import { SessionRepository } from "../repositories/session.repository";
import { LoginDto, RegisterDto } from "../dto/request.dto";
import { LoginResponseDto, RegisterUserResponseDto } from "../dto/response.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepo: AuthRepository,
        private readonly tokenService: TokenService,
        private readonly sessionRepo: SessionRepository,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.authRepo.findByEmail(dto.email, { select: { id: true } });

        if (existingUser) {
            throw new BaseException({
                code: ErrorCode.USER_EMAIL_EXISTS,
                message: 'Email already exists',
                status: HttpStatus.CONFLICT,
            })
        }

        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const userData = mapDtoToUser(dto, hashedPassword);
        const user = await this.authRepo.create(userData, {
            select: { id: true, email: true, firstName: true, lastName: true, }
        });
        return RegisterUserResponseDto.fromUser(user);
    }

    async login(dto: LoginDto, userAgent?: string, ip?: string): Promise<LoginResponseDto> {
        const user = await this.authRepo.findByEmail(dto.email, {
            select: {
                id: true,
                email: true,
                password: true,
                isActive: true,
            }
        })
        if (!user) {
            throw new BaseException({
                code: ErrorCode.AUTH_INVALID_CREDENTIALS,
                message: 'Invalid credentials',
                status: HttpStatus.UNAUTHORIZED,
            })
        }

        if (!user.isActive) {
            throw new BaseException({
                code: ErrorCode.USER_INVALID,
                message: 'Invalid credentials',
                status: HttpStatus.FORBIDDEN,
            })
        }

        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) {
            throw new BaseException({
                code: ErrorCode.AUTH_INVALID_CREDENTIALS,
                message: 'Invalid credentials',
                status: HttpStatus.UNAUTHORIZED,
            })
        }
        const payload = {
            sub: user.id,
            email: user.email,
        }

        const accessToken = this.tokenService.generateAccessToken(payload);
        const refreshToken = this.tokenService.generateRefreshToken(payload);

        const existingSession = await this.sessionRepo.findActiveSessionByDevice(user.id, userAgent, ip, {
            select: {
                id: true,
            }
        });

        if(existingSession) {
            await this.sessionRepo.revokedById(existingSession.id);
        }

        await this.sessionRepo.create({
            user: {
                connect: { id: user.id }
            },
            refreshToken,
            userAgent,
            ip,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return LoginResponseDto.create({
            accessToken,
            refreshToken,
            accessTokenExpiresIn: this.tokenService.getAccessTokenExpiresIn(),
            refreshTokenExpiresIn: this.tokenService.getRefreshTokenExpiresIn(),
        })
    }
}