import { HttpStatus, Injectable } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import * as bcrypt from 'bcryptjs';
import { mapDtoToUser, mapUserToDto } from "../auth.mapper";
import { TokenService } from "./token.service";
import { SessionRepository } from "../repositories/session.repository";
import { LoginDto, RegisterDto, UserResponseDto } from "../dto/request.dto";
import { LoginResponseClientDto, LoginResponseDto, RegisterUserResponseDto } from "../dto/response.dto";

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

        if (existingSession) {
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

    async refresh(refreshToken: string): Promise<LoginResponseClientDto> {
        const session = await this.sessionRepo.findByRefreshToken(refreshToken, {
            select: {
                id: true,
                refreshToken: true,
                revokedAt: true,
                isRevoked: true,
                expiresAt: true,
            }
        });
        if (!session) {
            throw new BaseException({
                code: ErrorCode.AUTH_INVALID_TOKEN,
                message: 'Invalid refresh token',
                status: HttpStatus.UNAUTHORIZED,
            });
        }

        if (session.isRevoked || session.expiresAt < new Date()) {
            throw new BaseException({
                code: ErrorCode.AUTH_INVALID_TOKEN,
                message: 'Refresh token expired or revoked',
                status: HttpStatus.UNAUTHORIZED,
            });
        }

        const payload = this.tokenService.verifyRefreshToken(refreshToken);
        const newAccessToken = this.tokenService.generateAccessToken({
            sub: payload.sub,
            email: payload.email,
        })

        return {
            accessToken: newAccessToken,
            accessTokenExpiresIn: this.tokenService.getAccessTokenExpiresIn(),
            refreshTokenExpiresIn: this.tokenService.getRefreshTokenExpiresIn(),
        }
    }

    async getMe(userId: number): Promise<UserResponseDto> {
        const user = await this.authRepo.findById(userId, {
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true,
                createdAt: true,
                dateOfBirth: true,
                avatarUrl: true,
                phone: true,
            }
        })
        if(!user) {
            throw new BaseException({
                code: ErrorCode.USER_NOT_FOUND,
                message: 'User not found',
                status: HttpStatus.NOT_FOUND,
            })
        }
        return mapUserToDto(user);
    }
}