import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { QueryOptions } from "src/common/types/query-options";
import { PrismaService } from "src/prisma/prisma.service";

type GroupUserQueryOptions = QueryOptions<Prisma.GroupUserSelect, Prisma.GroupUserInclude>;

@Injectable()
export class GroupUserRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.GroupUserCreateInput, options?: GroupUserQueryOptions) {
        return this.prisma.groupUser.create({
            data,
            ...options,
        })
    }

    async getRole(userId: number, groupId: number) {
        return this.prisma.groupUser.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId,
                }
            },
            select: {
                role: true,
            }
        })
    }
}