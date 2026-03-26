import { Injectable } from "@nestjs/common";
import { Group, GroupRole, Prisma, User } from "@prisma/client";
import { QueryOptions } from "src/common/types/query-options";
import { PrismaService } from "src/prisma/prisma.service";
import { FilterGroup } from "../dto/request.dto";
import { FilterMemberSearch, MemberSearchResultDto } from "src/modules/user/dto/response.dto";

type GroupQueryOptions = QueryOptions<Prisma.GroupSelect, Prisma.GroupInclude>;

@Injectable()
export class GroupRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.GroupCreateInput, options?: GroupQueryOptions): Promise<Group> {
        return this.prisma.group.create({
            data,
            ...options,
        })
    }

    async update(
        groupId: number,
        userId: number,
        data: Prisma.GroupUpdateInput,
        options?: GroupQueryOptions
    ): Promise<Group & { users: { role: GroupRole }[] }> {
        return this.prisma.group.update({
            where: { id: groupId },
            data: { name: data.name },
            include: {
                users: {
                    where: { userId },
                    select: { role: true },
                },
            },
            ...options,
        })
    }

    async findById(groupId: number, options?: GroupQueryOptions): Promise<Group | null> {
        return this.prisma.group.findUnique({
            where: {
                id: groupId,
            },
            ...options,
        })
    }

    async isMember(groupId: number, userId: number): Promise<boolean> {
        const count = await this.prisma.group.count({
            where: {
                id: groupId,
                users: {
                    some: {
                        userId: userId
                    }
                }
            },
        });
        return count > 0;
    }

    async getMyGroups(userId: number, filter: FilterGroup, options?: GroupQueryOptions):
        Promise<(Group & { users: { role: GroupRole }[] })[]> {
        const take = filter.take ?? 20;
        const cursorDate = filter.cursor ? new Date(filter.cursor) : undefined;
        return this.prisma.group.findMany({
            where: {
                users: {
                    some: {
                        userId
                    },
                },
                ...(filter.name ? {
                    name: {
                        contains: filter.name,
                    }
                } : {}),
                ...(cursorDate ? { updatedAt: { lt: cursorDate } } : {}),
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                users: {
                    where: {
                        userId,
                    },
                    select: {
                        role: true,
                    }
                }
            },
            take,
            ...options,
        })
    }

    async getMemberOfGroup(
        groupId: number,
        filter: FilterMemberSearch,
    ): Promise<{
        data: Prisma.GroupUserGetPayload<{
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                }
            };
        }>[];
        nextCursor: string | null;
    }> {
        const take = filter.take ?? 20;
        const cursor = filter.cursor
            ? JSON.parse(filter.cursor) as { createdAt: string; id: number }
            : undefined;

        const members = await this.prisma.groupUser.findMany({
            where: {
                groupId,
                ...(filter.name && {
                    user: {
                        OR: [
                            {
                                firstName: {
                                    contains: filter.name,
                                },
                            },
                            {
                                lastName: {
                                    contains: filter.name,
                                },
                            },
                        ],
                    },
                }),
            },
            orderBy: [
                { createdAt: "desc" },
                { id: "desc" },
            ],
            ...(cursor && {
                cursor: {
                    id: cursor.id,
                },
                skip: 1,
            }),

            take,

            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        const lastItem = members[members.length - 1];

        const nextCursor = lastItem
            ? JSON.stringify({
                createdAt: lastItem.createdAt,
                id: lastItem.id,
            })
            : null;
        return {
            data: members,
            nextCursor,
        };
    }
}