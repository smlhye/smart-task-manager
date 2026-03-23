import { ApiProperty } from "@nestjs/swagger";
import { Group, GroupUser } from "@prisma/client";

export class CreateGroupSuccess {
    @ApiProperty({ description: "ID of the newly created group", example: 1 })
    readonly id: number;

    @ApiProperty({ description: "Name of the group", example: 'NHÓM DEV - BACKEND' })
    readonly name: string;

    @ApiProperty({ description: "ID of the user who created the group", example: 1 })
    readonly userId: number;

    @ApiProperty({ description: "Role of the user within the group", example: 'Admin' })
    readonly role: string;

    @ApiProperty({ description: "Timestamp when the group was created (ISO string)", example: new Date().toISOString() })
    readonly createdAt: string;

    constructor(partial: Partial<CreateGroupSuccess>) {
        Object.assign(this, partial);
    }

    static fromModel(group: Group, groupUser: GroupUser): CreateGroupSuccess {
        return new CreateGroupSuccess({
            id: group.id,
            name: group.name,
            userId: groupUser.userId,
            role: groupUser.role,
            createdAt: group.createdAt.toISOString(),
        });
    }
}

export class GroupSuccess {
    @ApiProperty({ example: 1, description: 'Group ID' })
    id: number;

    @ApiProperty({ example: 'DEV Team', description: 'Group name' })
    name: string;

    @ApiProperty({ example: new Date().toISOString(), description: 'Group created at timestamp' })
    createdAt: string;

    @ApiProperty({ example: new Date().toISOString(), description: 'Group updated at timestamp' })
    updatedAt: string;

    constructor(partial: Partial<GroupSuccess>) {
        Object.assign(this, partial);
    }

    static fromModel(group: Group): GroupSuccess {
        return new GroupSuccess({
            id: group.id,
            name: group.name,
            createdAt: group.createdAt.toISOString(),
            updatedAt: group.updatedAt.toISOString(),
        })
    }
}