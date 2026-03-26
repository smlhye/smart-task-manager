import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class FindUserNotInGroupByEmail {
    @ApiProperty({
        description: "The email address of the user to be searched",
        example: "user001@example.com",
        required: true,
    })
    @IsEmail({}, { message: "Invalid email format" })
    email: string;
}