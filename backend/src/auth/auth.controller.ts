import { Body, Controller, Headers, HttpCode, HttpStatus, Ip, Post, Res } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginResponseClientDto, LoginResponseDto, RegisterUserResponseDto } from "./dto/response.dto";
import { LoginDto, RegisterDto } from "./dto/request.dto";
import type { Response } from "express";

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
        type: LoginResponseDto
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
}