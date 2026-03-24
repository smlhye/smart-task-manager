import { HttpStatus, Injectable } from "@nestjs/common";
import { GroupRepository } from "../repositories/group.repository";
import { CreateGroup, FilterGroup, UpdateGroup } from "../dto/request.dto";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import { CreateGroupSuccess, GroupDetailsSuccess, GroupSuccess } from "../dto/response.dto";
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

    async update(data: UpdateGroup, userId: number, groupId: number): Promise<GroupSuccess> {
        const groupExisted = await this.groupRepo.findById(groupId);
        if (!groupExisted) {
            throw new BaseException({
                code: ErrorCode.GROUP_NOT_FOUND,
                message: 'Group is not found',
                status: HttpStatus.NOT_FOUND,
            })
        }
        const updatedGroup = await this.groupRepo.update(groupId, userId, UpdateGroup.toModel(data));
        return GroupSuccess.fromModel(updatedGroup);
    }

    async getMyGroups(userId: number, filter: FilterGroup): Promise<GroupSuccess[]> {
        const groups = await this.groupRepo.getMyGroups(userId, filter);
        const groupsSuccess = groups.map((group) => GroupSuccess.fromModel(group));
        return groupsSuccess;
    }

    async getGroupById(groupId: number): Promise<GroupDetailsSuccess> {
        const group = await this.groupRepo.findById(groupId, {
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            }
        })
        if (!group) throw new BaseException({
            code: ErrorCode.GROUP_NOT_FOUND,
            message: 'Group is not found',
            status: HttpStatus.NOT_FOUND,
        })
        return GroupDetailsSuccess.fromModel(group);
    }
}