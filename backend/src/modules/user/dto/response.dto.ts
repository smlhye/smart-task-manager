import { ApiProperty } from "@nestjs/swagger";
import { GroupRole, GroupUser, Prisma, User } from "@prisma/client";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UserSearchResultDto {
    @ApiProperty({
        description: "Unique identifier of the user",
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: "User's first name",
        example: "John",
    })
    firstName: string;

    @ApiProperty({
        description: "User's last name",
        example: "Doe",
    })
    lastName: string;

    @ApiProperty({
        description: "User's email address",
        example: "john.doe@example.com",
    })
    email: string;

    @ApiProperty({
        description: "Indicates whether the user is already a member of the group",
        example: false,
    })
    isMember: boolean;

    constructor(partial: Partial<UserSearchResultDto>) {
        Object.assign(this, partial);
    }

    static fromModel(user: User, isMember: boolean): UserSearchResultDto {
        return new UserSearchResultDto({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isMember,
        });
    }
}

export class FilterMemberSearch {
    @ApiProperty({
        name: 'name',
        required: false,
        example: 'DEV',
        description: 'Filter member by first and last name',
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
        example: '{2026-03-23T10:00:00.000Z,1}',
        description: 'Cursor (created ISO string) and id of the last item from previous request',
    })
    @IsOptional()
    @IsString()
    cursor?: string;
}

type GroupUserWithPartialUser = {
    id: number;
    userId: number;
    groupId: number;
    createdAt: Date;
    role: GroupRole;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    }
}

export class MemberSearchResultDto {
    @ApiProperty({
        description: "Unique identifier of the user",
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: "User's first name",
        example: "John",
    })
    firstName: string;

    @ApiProperty({
        description: "User's last name",
        example: "Doe",
    })
    lastName: string;

    @ApiProperty({
        description: "User's email address",
        example: "john.doe@example.com",
    })
    email: string;

    @ApiProperty({
        description: "Role of member in the group",
        example: false,
    })
    role: string;

    constructor(partial: Partial<MemberSearchResultDto>) {
        Object.assign(this, partial);
    }

    static fromModel(model: GroupUserWithPartialUser): MemberSearchResultDto {
        return new MemberSearchResultDto({
            id: model.user.id,
            firstName: model.user.firstName,
            lastName: model.user.lastName,
            email: model.user.email,
            role: model.role,
        });
    }
}

export class MemberSearchResponse {
    @ApiProperty({ type: [MemberSearchResultDto] })
    members: MemberSearchResultDto[];

    @ApiProperty({ nullable: true })
    nextCursor: string | null;
}