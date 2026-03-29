import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class FindUserNotInGroupByEmail {
    @ApiProperty({
        description: "The email address of the user to be searched",
        example: "user001@example.com",
        required: true,
    })
    @IsEmail({}, { message: "Invalid email format" })
    email: string;
}

export class VerifyOtp {
    @ApiProperty({
        description: "The email address of the user to be searched",
        example: "user001@example.com",
        required: true,
    })
    @IsEmail({}, { message: "Invalid email format" })
    email: string;

    @ApiProperty({
        description: "6-digit OTP sent to the user",
        example: "123456",
        required: true,
    })
    @IsString({ message: "OTP must be a string" })
    @Length(6, 6, { message: "OTP must be exactly 6 characters" })
    otp: string;
}