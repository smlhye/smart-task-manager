import { Injectable } from "@nestjs/common";
import { Group, GroupRole, Prisma } from "@prisma/client";
import { QueryOptions } from "src/common/types/query-options";
import { PrismaService } from "src/prisma/prisma.service";
import { FilterGroup } from "../dto/request.dto";

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
}