import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Ip, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginResponseClientDto, RegisterUserResponseDto } from "./dto/response.dto";
import { ChangedPassword, ChangedPasswordForm, LoginDto, RegisterDto, UserResponseDto } from "./dto/request.dto";
import type { Request, Response } from "express";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { CurrentUserPayload } from "./strategies/jwt.strategy";
import { FindUserNotInGroupByEmail, VerifyOtp } from "../user/dto/request.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: 201,
        description: "User successfully registered",
        type: RegisterUserResponseDto
    })
    @ApiResponse({
        status: 409,
        description: "Email already exists",
    })
    async register(
        @Body() registerDto: RegisterDto
    ): Promise<RegisterUserResponseDto> {
        return this.authService.register(registerDto);
    }

    @Post('send-otp')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send OTP to user email' })
    @ApiResponse({
        status: 200,
        description: 'OTP sent successfully',
    })
    @ApiResponse({
        status: 429,
        description: 'You have sent OTP more than 5 times in 1 hour',
    })
    async sendOtp(@Body() dto: FindUserNotInGroupByEmail): Promise<void> {
        return this.authService.sendOtp(dto);
    }

    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify OTP sent to user email' })
    @ApiResponse({
        status: 200,
        description: 'OTP verified successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'OTP is invalid or expired',
    })
    @ApiResponse({
        status: 429,
        description: 'You have entered wrong OTP more than 5 times, please try again later',
    })
    async verifyOtp(@Body() dto: VerifyOtp): Promise<void> {
        return this.authService.verifyOtp(dto);
    }

    @Patch('change-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change user password' })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'User is not found',
    })
    async changePassword(@Body() dto: ChangedPassword): Promise<void> {
        return this.authService.changePassword(dto);
    }

    @Patch('change-password/form')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change user password' })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'User is not found',
    })
    async changePasswordForm(@CurrentUser() user: CurrentUserPayload, @Body() dto: ChangedPasswordForm): Promise<void> {
        return this.authService.changePasswordForm(user.userId, dto);
    }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'user-agent',
        required: false,
    })
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in',
        type: LoginResponseClientDto
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials',
    })
    async login(
        @Body() loginDto: LoginDto,
        @Headers('user-agent') userAgent: string,
        @Ip() ip: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponseClientDto> {
        const result = await this.authService.login(loginDto, userAgent, ip);
        res.cookie("refresh_token", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: result.refreshTokenExpiresIn * 1000,
            path: '/',
        })
        res.cookie("access_token", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: result.accessTokenExpiresIn * 1000,
            path: '/',
        })
        return {
            accessToken: result.accessToken,
            accessTokenExpiresIn: result.accessTokenExpiresIn,
            refreshTokenExpiresIn: result.refreshTokenExpiresIn,
        };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Refresh access token'
    })
    @ApiResponse({
        status: 200,
        description: 'Access token refreshed successfully',
        type: LoginResponseClientDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid or missing refresh token',
    })
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponseClientDto> {
        const refreshToken = req.cookies?.refresh_token;
        const accessToken = req.cookies?.access_token;

        if (!refreshToken) {
            throw new BaseException({
                code: ErrorCode.AUTH_INVALID_TOKEN,
                message: 'Missing refresh token',
                status: HttpStatus.UNAUTHORIZED,
            })
        }
        try {
            const result = await this.authService.refresh(refreshToken, accessToken);

            res.cookie("access_token", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: result.accessTokenExpiresIn * 1000,
                path: '/',
            })

            return result;
        } catch (err: any) {
            res.clearCookie('refresh_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            throw new BaseException({
                code: ErrorCode.AUTH_INVALID_TOKEN,
                message: 'Refresh token invalid or revoked',
                status: HttpStatus.UNAUTHORIZED,
            });
        }
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user' })
    @ApiResponse({
        status: 200,
        type: UserResponseDto,
    })
    async getMe(@CurrentUser() user: CurrentUserPayload): Promise<UserResponseDto> {
        return this.authService.getMe(user.userId);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Log out user from current device' })
    @ApiResponse({
        status: 200
    })
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refresh_token;
        const accessToken = req.cookies?.access_token;
        const data = await this.authService.logoutCurrentDevice(refreshToken, accessToken);
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        return data;
    }

    @Post('logout/all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Log out user from current device' })
    @ApiResponse({
        status: 200
    })
    async logoutMultiDevice(
        @CurrentUser() user: CurrentUserPayload,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refresh_token;
        const data = await this.authService.logoutMultiDevice(user.userId, refreshToken);
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        return data;
    }
}