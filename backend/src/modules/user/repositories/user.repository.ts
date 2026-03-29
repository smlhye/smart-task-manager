import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { QueryOptions } from "src/common/types/query-options";
import { PrismaService } from "src/prisma/prisma.service";

type UserQueryOptions = QueryOptions<Prisma.UserSelect, Prisma.UserInclude>;

@Injectable()
export class UserRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }
    async findByEmail(email: string, options?: UserQueryOptions,): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
            ...options,
        });
    }

    async update(id: number, input: Prisma.UserUpdateInput, options?: UserQueryOptions,) {
        return this.prisma.user.update({
            where: {
                id
            },
            data: input,
            ...options,
        });
    }

    async findById(id: number, options?: UserQueryOptions): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
            ...options,
        });
    }

    async create(data: Prisma.UserCreateInput, options: UserQueryOptions): Promise<User> {
        return this.prisma.user.create({ data, ...options });
    }

    async getMember(userId: number, groupId: number): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                groups: {
                    some: {
                        groupId: groupId,
                    }
                }
            },
        })
    }
}