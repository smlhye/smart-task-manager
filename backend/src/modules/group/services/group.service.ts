import { HttpStatus, Injectable } from "@nestjs/common";
import { GroupRepository } from "../repositories/group.repository";
import { CreateGroup, FilterGroup } from "../dto/request.dto";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import { CreateGroupSuccess, GroupSuccess } from "../dto/response.dto";
import { GroupUserRepository } from "../repositories/group-user.repository";
import { GroupRole } from "@prisma/client";

@Injectable()
export class GroupService {
    constructor(
        private readonly groupRepo: GroupRepository,
        private readonly groupUserRepo: GroupUserRepository,
    ) { }

    async create(data: CreateGroup, userId: number): Promise<CreateGroupSuccess> {
        const createdGroup = await this.groupRepo.create(CreateGroup.toModel(data), {
            select: {
                id: true,
                name: true,
                createdAt: true,
            }
        });
        const createdGroupUser = await this.groupUserRepo.create({
            role: GroupRole.ADMIN,
            user: {
                connect: { id: userId }
            },
            group: {
                connect: { id: createdGroup.id }
            }
        })
        return CreateGroupSuccess.fromModel(createdGroup, createdGroupUser);
    }

    async getMyGroups(userId: number, filter: FilterGroup): Promise<GroupSuccess[]> {
        const groups = await this.groupRepo.getMyGroups(userId, filter, {
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            }
        })
        const groupsSuccess = groups.map((item) => GroupSuccess.fromModel(item));
        return groupsSuccess;
    }
}