import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Ip, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginResponseClientDto, RegisterUserResponseDto } from "./dto/response.dto";
import { LoginDto, RegisterDto, UserResponseDto } from "./dto/request.dto";
import type { Request, Response } from "express";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { CurrentUserPayload } from "./strategies/jwt.strategy";

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

        if (!refreshToken) {
            throw new BaseException({
                code: ErrorCode.AUTH_INVALID_TOKEN,
                message: 'Missing refresh token',
                status: HttpStatus.UNAUTHORIZED,
            })
        }

        return this.authService.refresh(refreshToken);
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
        console.log('USER:', user);
        return this.authService.getMe(user.userId);
    }
}