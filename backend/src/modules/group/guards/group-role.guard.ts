import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GroupUserRepository } from "../repositories/group-user.repository";
import { GroupRole } from "@prisma/client";
import { GROUP_ROLE_KEY } from "../decorators/group-role.decorator";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";

@Injectable()
export class GroupRoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly groupUserRepo: GroupUserRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<GroupRole[]>(
            GROUP_ROLE_KEY,
            context.getHandler(),
        ) || [];

        if (!requiredRoles.length) return true;
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.userId;
        const groupId = request.body?.groupId || request.params?.groupId || request.query?.groupId;
        if (!groupId) {
            throw new BaseException({
                code: ErrorCode.GROUP_MEMBER_NOT_FOUND,
                message: 'GroupId is required',
                status: HttpStatus.FORBIDDEN
            });
        }
        const membership = await this.groupUserRepo.getRole(userId, Number(groupId));
        if (!membership || !requiredRoles.includes(membership.role)) {
            throw new BaseException({
                code: ErrorCode.PERMISSION_DENIED,
                message: 'Permission denied',
                status: HttpStatus.FORBIDDEN
            })
        }
        return true;
    }
}