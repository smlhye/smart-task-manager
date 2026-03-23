import { Injectable } from "@nestjs/common";
import { RevokedToken } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RevokedTokenRepository {
    constructor(private readonly prisma: PrismaService) { }
    async cleanExpiredTokens() {
        return this.prisma.revokedToken.deleteMany({
            where: {
                OR: [{
                    expiresAt: {
                        lt: new Date(),
                    }
                }, {
                    revoked: true,
                }]

            }
        })
    }

    async create(token: string, userId: number, expiresAt: Date) {
        return await this.prisma.revokedToken.create({
            data: {
                token,
                userId,
                expiresAt,
            }
        })
    }

    async revoked(token: string) {
        return await this.prisma.revokedToken.update({
            where: {
                token,
            }, data: {
                revoked: true,
            }
        })
    }

    async revokedAllByUserId(userId: number) {
        return await this.prisma.revokedToken.updateMany({
            where: {
                userId,
            }, data: {
                revoked: true,
            }
        })
    }

    async findByToken(token: string): Promise<RevokedToken | null> {
        return await this.prisma.revokedToken.findUnique({
            where: {
                token,
            }
        })
    }
}