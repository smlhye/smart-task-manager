import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    @Transform(({ value }) => value.toLowerCase().trim())
    email: string;

    @ApiProperty({
        example: "Admin123456",
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @MaxLength(32, { message: 'Password must not exceed 32 characters' })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, { message: 'Password must include uppercase, lowercase and number' })
    password: string;

    @ApiProperty({
        example: "Trần",
    })
    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    @MaxLength(50)
    @MinLength(2)
    @Transform(({ value }) => value.trim())
    firstName: string;

    @ApiProperty({
        example: "Văn Bánh",
    })
    @IsString()
    @IsNotEmpty({ message: 'Last name is required' })
    @MaxLength(50)
    @MinLength(2)
    @Transform(({ value }) => value.trim())
    lastName: string;

    @ApiPropertyOptional({
        example: "+84912345678",
    })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @Matches(/^\+?\d{7,15}$/, { message: 'Invalid phone number' })
    phone?: string;

    @ApiPropertyOptional({
        example: "1995-01-01",
    })
    @IsOptional()
    @IsDateString({}, { message: 'Date of birth must be a valid ISO date string' })
    dateOfBirth?: string;
}