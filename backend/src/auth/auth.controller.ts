import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegisterDto } from "./dto/register.dto";
import { RegisterUserResponseDto } from "./dto/user-response.dto";

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
}