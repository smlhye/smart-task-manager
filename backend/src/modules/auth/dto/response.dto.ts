import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserResponseDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;

    constructor(partial: Partial<RegisterUserResponseDto>) {
        Object.assign(this, partial);
    }

    static fromUser(user: { id: number, email: string, firstName: string, lastName: string }) {
        return new RegisterUserResponseDto(user);
    }
}

export class LoginResponseDto {
    @ApiProperty({
        description: 'JWT access token',
    })
    accessToken: string;

    @ApiProperty({
        description: "JWT refresh token",
    })
    refreshToken: string;

    @ApiProperty({
        description: "Access token expires in seconds",
        example: 900,
    })
    accessTokenExpiresIn: number;

    @ApiProperty({
        description: "Refresh token expires in seconds",
        example: 604800,
    })
    refreshTokenExpiresIn: number;

    @ApiProperty({
        description: "Refresh token expiry timestamp",
    })
    refreshTokenExpiresAt: Date;

    constructor(partial: Partial<LoginResponseDto>) {
        Object.assign(this, partial);
    }

    static create(data: {
        accessToken: string;
        refreshToken: string;
        accessTokenExpiresIn: number;
        refreshTokenExpiresIn: number;
    }) {
        const now = Date.now();
        return new LoginResponseDto({
            ...data,
            refreshTokenExpiresAt: new Date(
                now + data.refreshTokenExpiresIn * 1000,
            ),
        });
    }
}

export class LoginResponseClientDto {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
}