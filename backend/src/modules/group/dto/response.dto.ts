import { ApiProperty } from "@nestjs/swagger";
import { Group, GroupUser } from "@prisma/client";

export class CreateGroupSuccess {
    id: number;
    name: string;
    userId: number;
    role: string;
    createAt: string;

    constructor(partial: Partial<CreateGroupSuccess>) {
        Object.assign(this, partial);
    }

    static fromModel(group: Group, groupUser: GroupUser) {
        return new CreateGroupSuccess({
            id: group.id,
            name: group.name,
            userId: groupUser.userId,
            role: groupUser.role,
            createAt: group.createdAt.toISOString(),
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