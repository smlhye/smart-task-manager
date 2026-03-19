import { Injectable } from "@nestjs/common";
import { Prisma, Session } from "@prisma/client";
import { QueryOptions } from "src/common/types/query-options";
import { PrismaService } from "src/prisma/prisma.service";

type SessionQueryOptions = QueryOptions<Prisma.SessionSelect, Prisma.SessionInclude>;

@Injectable()
export class SessionRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.SessionCreateInput, options?: SessionQueryOptions): Promise<Session> {
        return this.prisma.session.create({
            data,
            ...options,
        })
    }

    async findByRefreshToken(refreshToken: string): Promise<Session | null> {
        return this.prisma.session.findUnique({
            where: { refreshToken },
        });
    }

    async deleteById(id: number) {
        return this.prisma.session.delete({
            where: { id }
        });
    }

    async deleteByUserId(userId: number) {
        return this.prisma.session.deleteMany({
            where: { userId },
        })
    }

    async findActiveSessionByDevice(userId: number, userAgent?: string, ip?: string, options?: SessionQueryOptions): Promise<Session | null> {
        return this.prisma.session.findFirst({
            where: {
                userId,
                userAgent,
                ip,
                isRevoked: false,
                expiresAt: {
                    gt: new Date(),
                }
            },
            ...options,
        })
    }

    async revokedById(id: number) {
        return this.prisma.session.update({
            where: { id },
            data: {
                isRevoked: true,
                revokedAt: new Date(),
            }
        })
    }

    async revokedByUserId(userId: number) {
        return this.prisma.session.updateMany({
            where: { userId },
            data: {
                isRevoked: true,
                revokedAt: new Date(),
            }
        })
    }

    async cleanupExpiredAndRevokedSessions() {
        return this.prisma.session.deleteMany({
            where: {
                OR: [{
                    expiresAt: {
                        lt: new Date(),
                    }
                }, {
                    isRevoked: true,
                }]
            }
        })
    }
}