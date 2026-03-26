import { HttpStatus, Injectable } from "@nestjs/common";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import * as bcrypt from 'bcryptjs';
import { mapDtoToUser, mapUserToDto } from "../auth.mapper";
import { TokenService } from "./token.service";
import { SessionRepository } from "../repositories/session.repository";
import { LoginDto, RegisterDto, UserResponseDto } from "../dto/request.dto";
import { LoginResponseClientDto, LoginResponseDto, RegisterUserResponseDto } from "../dto/response.dto";
import { RevokedTokenRepository } from "../repositories/revoked-token.repository";
import { createHash } from "crypto";
import { UserRepository } from "src/modules/user/repositories/user.repository";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly tokenService: TokenService,
        private readonly sessionRepo: SessionRepository,
        private readonly revokedTokenRepo: RevokedTokenRepository
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.userRepo.findByEmail(dto.email, { select: { id: true } });

        if (existingUser) {
            throw new BaseException({
                code: ErrorCode.USER_EMAIL_EXISTS,
                message: 'Email already exists',
                status: HttpStatus.CONFLICT,
            })
        }

        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const userData = mapDtoToUser(dto, hashedPassword);
        const user = await this.userRepo.create(userData, {
            select: { id: true, email: true, firstName: true, lastName: true, }
        });
        return RegisterUserResponseDto.fromUser(user);
    }

    async login(dto: LoginDto, userAgent?: string, ip?: string): Promise<LoginResponseDto> {
        const user = await this.userRepo.findByEmail(dto.email, {
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

        const expiresInSeconds = this.tokenService.getAccessTokenExpiresIn();
        const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

        await this.revokedTokenRepo.create(
            createHash('sha256').update(accessToken).digest('hex'),
            user.id,
            expiresAt
        )

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

    async refresh(refreshToken: string, accessToken?: string): Promise<LoginResponseClientDto> {
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

        const expiresInSeconds = this.tokenService.getAccessTokenExpiresIn();
        const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

        if (accessToken) {
            const hashedToken = createHash('sha256').update(accessToken).digest('hex');
            const hasedTokenExisted = await this.revokedTokenRepo.findByToken(hashedToken);
            if (hasedTokenExisted) {
                await this.revokedTokenRepo.revoked(hashedToken);
            }
        }

        await this.revokedTokenRepo.create(
            createHash('sha256').update(newAccessToken).digest('hex'),
            payload.sub,
            expiresAt
        )

        return {
            accessToken: newAccessToken,
            accessTokenExpiresIn: this.tokenService.getAccessTokenExpiresIn(),
            refreshTokenExpiresIn: this.tokenService.getRefreshTokenExpiresIn(),
        }
    }

    async getMe(userId: number): Promise<UserResponseDto> {
        const user = await this.userRepo.findById(userId, {
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
        if (!user) {
            throw new BaseException({
                code: ErrorCode.USER_NOT_FOUND,
                message: 'User not found',
                status: HttpStatus.NOT_FOUND,
            })
        }

        if (!user.isActive) {
            throw new BaseException({
                code: ErrorCode.USER_INVALID,
                message: 'User is inactive',
                status: 403,
            })
        }
        return mapUserToDto(user);
    }

    async logoutCurrentDevice(refreshToken?: string, accessToken?: string) {
        if (!refreshToken) throw new BaseException({
            code: ErrorCode.AUTH_INVALID_TOKEN,
            message: 'Refresh token missing',
            status: 400
        })

        if (accessToken) {
            const hashedToken = createHash('sha256').update(accessToken).digest('hex');
            const hasedTokenExisted = await this.revokedTokenRepo.findByToken(hashedToken);
            if (hasedTokenExisted) {
                await this.revokedTokenRepo.revoked(hashedToken);
            }
        }

        const token = await this.sessionRepo.findByRefreshToken(refreshToken);
        if (!token) {
            throw new BaseException({
                code: ErrorCode.AUTH_INVALID_TOKEN,
                message: 'Refresh token not found',
                status: 404,
            })
        }
        await this.sessionRepo.revokedById(token.id);
        return { message: 'Logged out from current device successfully' };
    }

    async logoutMultiDevice(userId: number, refreshToken?: string) {
        if (!refreshToken) throw new BaseException({
            code: ErrorCode.AUTH_INVALID_TOKEN,
            message: 'Refresh token missing',
            status: 400
        })
        const token = await this.sessionRepo.findByRefreshToken(refreshToken);
        if (!token) {
            throw new BaseException({
                code: ErrorCode.AUTH_INVALID_TOKEN,
                message: 'Refresh token not found',
                status: 404,
            })
        }
        const user = await this.userRepo.findById(userId, {
            select: {
                id: true,
                isActive: true,
            }
        });
        if (!user) {
            throw new BaseException({
                code: ErrorCode.USER_NOT_FOUND,
                message: 'User not found',
                status: 404,
            })
        }
        if (!user.isActive) {
            throw new BaseException({
                code: ErrorCode.USER_INVALID,
                message: 'User is inactive',
                status: 403,
            })
        }
        await this.sessionRepo.revokedByUserId(user.id);
        await this.revokedTokenRepo.revokedAllByUserId(user.id);
        return { message: 'Logged out from all devices successfully' };
    }
}