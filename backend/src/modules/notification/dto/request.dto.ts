import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class FilterNotification {
    @ApiProperty({
        name: 'take',
        required: false,
        example: 20,
        description: 'Number of items to fetch per request',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    take?: number;

    @ApiProperty({
        name: 'cursor',
        required: false,
        example: '2026-03-23T10:00:00.000Z',
        description: 'Cursor (created ISO string) of the last item from previous request',
    })
    @IsOptional()
    @IsString()
    cursor?: string;
}