import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateGroup {
    @ApiProperty({ example: 'NHÓM DEV - BACKEND' })
    @IsNotEmpty({ message: 'Name is required' })
    @Transform(({ value }) => value.trim())
    name: string;

    static toModel(data: CreateGroup): Prisma.GroupCreateInput {
        return {
            name: data.name,
        }
    }
}

export class UpdateGroup {
    @ApiProperty({ example: 'NHÓM DEV - BACKEND' })
    @IsNotEmpty({ message: 'Name is required' })
    @Transform(({ value }) => value.trim())
    name: string;

    static toModel(data: UpdateGroup): Prisma.GroupUpdateInput {
        return {
            name: data.name,
        }
    }
}

export class FilterGroup {
    @ApiProperty({
        name: 'name',
        required: false,
        example: 'DEV',
        description: 'Filter groups by name',
    })
    @IsOptional()
    @IsString()
    name?: string;

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
        description: 'Cursor (updatedAt ISO string) of the last item from previous request',
    })
    @IsOptional()
    @IsString()
    cursor?: string;
}