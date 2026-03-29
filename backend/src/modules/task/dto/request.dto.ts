import { ApiProperty } from "@nestjs/swagger";
import { Priority, TaskStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateTask {
    @ApiProperty({ example: 'Thiết kế UI trang Dashboard', description: 'Title' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Tạo wireframe và mockup', description: 'Description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: Priority.MEDIUM, description: 'Priority' })
    @IsString()
    priority: string;

    @ApiProperty({ example: new Date().toISOString(), description: 'Deadline' })
    @IsString()
    deadline: string;

    @ApiProperty({ example: [1, 2, 3], description: 'ID Members assigned' })
    @IsArray()
    assignees: number[];

    constructor(partial: Partial<CreateTask>) {
        Object.assign(this, partial);
    }
}

export class UpdateTask {
    @ApiProperty({ example: 'Thiết kế UI trang Dashboard', description: 'Title' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Tạo wireframe và mockup', description: 'Description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: Priority.MEDIUM, description: 'Priority' })
    @IsString()
    priority: string;

    @ApiProperty({ example: new Date().toISOString(), description: 'Deadline' })
    @IsString()
    deadline: string;

    @ApiProperty({ example: TaskStatus.PENDING, description: 'Status' })
    @IsString()
    status: string;

    @ApiProperty({ example: [1, 2, 3], description: 'ID Members assigned' })
    @IsArray()
    assignees: number[];

    constructor(partial: Partial<CreateTask>) {
        Object.assign(this, partial);
    }
}

export class FilterTask {
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
        example: '{2026-03-23T10:00:00.000Z,1}',
        description: 'Cursor (updated ISO string) and id of the last item from previous request',
    })
    @IsOptional()
    @IsString()
    cursor?: string;
}