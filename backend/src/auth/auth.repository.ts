import { Injectable } from "@nestjs/common";
import { QueryOptions } from "src/common/types/query-options";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

type UserQueryOptions = QueryOptions<Prisma.UserSelect, Prisma.UserInclude>;

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string, options?: UserQueryOptions,): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
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
}