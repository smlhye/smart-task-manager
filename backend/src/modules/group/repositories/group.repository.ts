import { Injectable } from "@nestjs/common";
import { Group, Prisma } from "@prisma/client";
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

    async getMyGroups(userId: number, filter: FilterGroup, options?: GroupQueryOptions): Promise<Group[]> {
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
            take,
            ...options,
        })
    }
}