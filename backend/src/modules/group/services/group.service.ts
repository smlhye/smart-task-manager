import { HttpStatus, Injectable } from "@nestjs/common";
import { GroupRepository } from "../repositories/group.repository";
import { CreateGroup, FilterGroup, UpdateGroup } from "../dto/request.dto";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import { CreateGroupSuccess, GroupDetailsSuccess, GroupSuccess } from "../dto/response.dto";
import { GroupUserRepository } from "../repositories/group-user.repository";
import { GroupRole, Prisma, TaskStatus } from "@prisma/client";
import { ChangeRole, FindUserNotInGroupByEmail } from "src/modules/user/dto/request.dto";
import { FilterMemberSearch, MemberSearchResponse, MemberSearchResultDto, UserSearchResultDto } from "src/modules/user/dto/response.dto";
import { UserRepository } from "src/modules/user/repositories/user.repository";
import { NotificationService } from "src/modules/notification/services/notification.service";
import { NotificationSuccess } from "src/modules/notification/dto/response.dto";
import { TaskRepository } from "src/modules/task/repositories/task.repository";
import { FilterTask } from "src/modules/task/dto/request.dto";
import { CountTask, TaskCreatedSuccess, TaskItemSuccess } from "src/modules/task/dto/response.dto";

@Injectable()
export class GroupService {
    constructor(
        private readonly groupRepo: GroupRepository,
        private readonly groupUserRepo: GroupUserRepository,
        private readonly userRepo: UserRepository,
        private readonly notificationService: NotificationService,
        private readonly taskRepository: TaskRepository,
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

    async findByGroupIdAndStatus(groupId: number, filter: FilterTask, status: TaskStatus): Promise<TaskCreatedSuccess[]> {
        const tasks = await this.taskRepository.findByGroupIdAndStatus(groupId, filter, status);
        const tasksSuccess = tasks.map((task) => TaskItemSuccess.fromModel(task));
        return tasksSuccess;
    }

    async getMemberOfGroup(groupId: number, filter: FilterMemberSearch): Promise<MemberSearchResponse> {
        const result = await this.groupRepo.getMemberOfGroup(groupId, filter);
        const members = result.data.map((group) =>
            MemberSearchResultDto.fromModel(group)
        );
        return {
            members,
            nextCursor: result.nextCursor,
        };
    }

    async getMember(groupId: number, userId: number): Promise<MemberSearchResultDto> {
        const group = await this.groupRepo.findById(groupId);
        if (!group) throw new BaseException({
            code: ErrorCode.GROUP_NOT_FOUND,
            message: 'Group is not found',
            status: HttpStatus.NOT_FOUND,
        })
        const isMember = await this.groupRepo.isMember(groupId, userId);
        if (!isMember) throw new BaseException({
            code: ErrorCode.GROUP_MEMBER_NOT_FOUND,
            message: 'You is not member of group',
            status: HttpStatus.NOT_FOUND,
        });

        const user = await this.userRepo.findById(userId);
        const role = await this.groupUserRepo.getRole(userId, groupId);
        return new MemberSearchResultDto({
            id: user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            role: role?.role,
        })
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

    async findMemberInGroupByEmail(data: FindUserNotInGroupByEmail, groupId: number): Promise<UserSearchResultDto> {
        const { email } = data;
        const user = await this.userRepo.findByEmail(email, {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
            }
        });
        if (!user) throw new BaseException({
            code: ErrorCode.USER_NOT_FOUND,
            message: 'User is not found',
            status: HttpStatus.NOT_FOUND,
        })

        if (!user.isActive) throw new BaseException({
            code: ErrorCode.USER_INVALID,
            message: 'User is inactive',
            status: HttpStatus.BAD_REQUEST
        });

        const group = await this.groupRepo.findById(groupId);
        if (!group) throw new BaseException({
            code: ErrorCode.GROUP_NOT_FOUND,
            message: 'Group is not found',
            status: HttpStatus.NOT_FOUND,
        })
        const isMember = await this.groupRepo.isMember(groupId, user.id);
        return UserSearchResultDto.fromModel(user, isMember);
    }

    async invitedUser(groupId: number, senderId: number, receiverId: number) {
        const group = await this.groupRepo.findById(groupId);
        if (!group) throw new BaseException({
            code: ErrorCode.GROUP_NOT_FOUND,
            message: 'Group is not found',
            status: HttpStatus.NOT_FOUND,
        })
        const sender = await this.userRepo.findById(senderId, {
            select: {
                id: true, isActive: true,
            }
        });
        if (!sender) throw new BaseException({
            code: ErrorCode.USER_NOT_FOUND,
            message: 'Sender is not found',
            status: HttpStatus.NOT_FOUND,
        })
        if (!sender.isActive) throw new BaseException({
            code: ErrorCode.USER_NOT_FOUND,
            message: 'Sender is inactive',
            status: HttpStatus.BAD_REQUEST,
        })
        const receiver = await this.userRepo.findById(receiverId, {
            select: {
                id: true, isActive: true,
            }
        });
        if (!receiver) throw new BaseException({
            code: ErrorCode.USER_NOT_FOUND,
            message: 'Receiver is not found',
            status: HttpStatus.NOT_FOUND,
        })
        if (!receiver.isActive) throw new BaseException({
            code: ErrorCode.USER_NOT_FOUND,
            message: 'Receiver is inactive',
            status: HttpStatus.BAD_REQUEST,
        })

        const isMember = await this.groupRepo.isMember(groupId, receiverId);
        if (isMember) throw new BaseException({
            code: ErrorCode.GROUP_MEMBER_EXISTS,
            message: 'User is already a member',
            status: HttpStatus.CONFLICT
        })
        const message = `Bạn được mời vào nhóm ${group.name}`;
        const notification = await this.notificationService.createInviteNotification(senderId, receiverId, groupId, message);
        return NotificationSuccess.fromModel(notification);
    }

    async countTask(groupId: number): Promise<CountTask> {
        const group = await this.groupRepo.findById(groupId);
        if (!group) throw new BaseException({
            code: ErrorCode.GROUP_NOT_FOUND,
            message: 'Group is not found',
            status: HttpStatus.NOT_FOUND,
        })
        return this.taskRepository.countTask(groupId);
    }

    async changeRole(groupId: number, data: ChangeRole) {
        const group = await this.groupRepo.findById(groupId);
        if (!group) throw new BaseException({
            code: ErrorCode.GROUP_NOT_FOUND,
            message: 'Group is not found',
            status: HttpStatus.NOT_FOUND,
        })
        const isMember = await this.groupRepo.isMember(groupId, data.userId);
        if (!isMember) throw new BaseException({
            code: ErrorCode.GROUP_MEMBER_NOT_FOUND,
            message: 'You is not member of group',
            status: HttpStatus.NOT_FOUND,
        });
        const update: Prisma.GroupUserUpdateInput = {
            role: data.role,
        }
        await this.groupUserRepo.update(data.userId, groupId, update);
    }

    async getRoles() {
        const roles = Object.values(GroupRole);
        return { roles };
    }
}