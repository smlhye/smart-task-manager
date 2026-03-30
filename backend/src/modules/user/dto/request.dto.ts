import { ApiProperty } from "@nestjs/swagger";
import { GroupRole } from "@prisma/client";
import { IsEmail, IsEnum, IsNumber, IsString, Length } from "class-validator";

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

export class ChangeRole {
    @ApiProperty({
        description: "The ID of the user",
        example: 1,
        required: true,
    })
    @IsNumber({}, { message: "userId must be a number" })
    userId: number;

    @ApiProperty({
        description: "The role assigned to the user",
        enum: GroupRole,
        example: GroupRole.ADMIN,
        required: true,
    })
    @IsEnum(GroupRole, { message: "Invalid role value" })
    role: GroupRole;
}