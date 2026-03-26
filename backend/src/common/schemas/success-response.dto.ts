import { ApiProperty } from "@nestjs/swagger";
import { ErrorCode } from "../errors/error-codes";
import { IsBoolean, IsEnum, IsObject, IsOptional, IsString } from "class-validator";
import { HttpStatus } from "@nestjs/common";


class ErrorDetailDto {
    @ApiProperty({ enum: ErrorCode, description: 'Error code identifier' })
    @IsEnum(ErrorCode)
    code: ErrorCode;

    @ApiProperty({ example: 'Error message', description: 'Error message' })
    @IsString()
    message: string;
}

export class SuccessResponseDto<T> {
    @ApiProperty({ description: 'Ok', example: HttpStatus.OK })
    statusCode: number;

    @ApiProperty({ description: 'Successfully', example: true })
    @IsBoolean()
    success: boolean;

    @ApiProperty({ description: 'Error details', type: ErrorDetailDto, required: false })
    @IsObject()
    error?: ErrorDetailDto;

    @ApiProperty({ description: 'Optional data', required: false, example: null })
    @IsOptional()
    data?: T;
}