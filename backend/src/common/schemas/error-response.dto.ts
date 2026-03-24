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

export class ErrorResponseDto {
    @ApiProperty({ description: 'HTTP status code of the response', example: HttpStatus.INTERNAL_SERVER_ERROR })
    statusCode: number;

    @ApiProperty({ description: 'Indicates if the operation was successful', example: false })
    @IsBoolean()
    success: boolean;

    @ApiProperty({ description: 'Error details', type: ErrorDetailDto })
    @IsObject()
    error: ErrorDetailDto;

    @ApiProperty({ description: 'Optional data', required: false, example: null })
    @IsOptional()
    data?: any;
}