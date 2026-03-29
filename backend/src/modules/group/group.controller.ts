import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { GroupService } from "./services/group.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateGroupSuccess, GroupDetailsSuccess, GroupSuccess } from "./dto/response.dto";
import { CreateGroup, FilterGroup, UpdateGroup } from "./dto/request.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { CurrentUserPayload } from "../auth/strategies/jwt.strategy";
import { HasGroupRole } from "./decorators/group-role.decorator";
import { GroupRole } from "@prisma/client";
import { ErrorResponseDto } from "src/common/schemas/error-response.dto";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import { GroupRoleGuard } from "./guards/group-role.guard";
import { FilterMemberSearch, MemberSearchResponse, MemberSearchResultDto, UserSearchResultDto } from "../user/dto/response.dto";
import { FindUserNotInGroupByEmail } from "../user/dto/request.dto";
import { SuccessResponseDto } from "src/common/schemas/success-response.dto";
import { NotificationSuccess } from "../notification/dto/response.dto";
import { TaskService } from "../task/services/task.service";
import { CountTask, TaskCreatedSuccess, TaskItemSuccess } from "../task/dto/response.dto";
import { CreateTask, FilterTask, UpdateTask } from "../task/dto/request.dto";

@ApiTags('Group')
@Controller('groups')
export class GroupController {
    constructor(
        private readonly groupService: GroupService,
        private readonly taskService: TaskService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new group' })
    @ApiResponse({
        status: 201,
        description: "Group successfully created",
        type: CreateGroupSuccess
    })
    @ApiResponse({
        status: 500,
        description: "Internal server error",
    })
    async create(
        @Body() data: CreateGroup,
        @CurrentUser() user: CurrentUserPayload,
    ): Promise<CreateGroupSuccess> {
        return this.groupService.create(data, user.userId);
    }

    @Put(':groupId')
    @UseGuards(JwtAuthGuard, GroupRoleGuard)
    @ApiBearerAuth()
    @HasGroupRole(GroupRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a group' })
    @ApiResponse({
        status: 201,
        description: "Group successfully updated",
        type: GroupSuccess
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Group is not found",
    })
    async update(
        @Body() data: UpdateGroup,
        @CurrentUser() user: CurrentUserPayload,
        @Param('groupId') id: string,
    ): Promise<GroupSuccess> {
        return this.groupService.update(
            data,
            user.userId,
            Number(id),
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get my groups'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: [GroupSuccess]
    })
    async getMyGroups(
        @CurrentUser() user: CurrentUserPayload,
        @Query() filter: FilterGroup
    ): Promise<GroupSuccess[]> {
        return this.groupService.getMyGroups(user.userId, filter);
    }

    @Get(':groupId/members')
    @UseGuards(JwtAuthGuard)
    @HasGroupRole(GroupRole.ADMIN, GroupRole.MEMBER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get member of the group'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessResponseDto<MemberSearchResponse>
    })
    async getMemberOfGroup(
        @Query() filter: FilterMemberSearch,
        @Param('groupId', ParseIntPipe) groupId: number
    ): Promise<MemberSearchResponse> {
        return this.groupService.getMemberOfGroup(groupId, filter);
    }

    @Get(':groupId/tasks/pending')
    @UseGuards(JwtAuthGuard)
    @HasGroupRole(GroupRole.ADMIN, GroupRole.MEMBER, GroupRole.VIEWER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get list tasks is pending of group'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessResponseDto<[TaskItemSuccess]>
    })
    async getTasksPending(
        @Param('groupId', ParseIntPipe) groupId: number,
        @Query() filter: FilterTask
    ): Promise<TaskItemSuccess[]> {
        return this.groupService.findByGroupIdAndStatus(groupId, filter, 'PENDING');
    }

    @Get(':groupId/tasks/in-progress')
    @UseGuards(JwtAuthGuard)
    @HasGroupRole(GroupRole.ADMIN, GroupRole.MEMBER, GroupRole.VIEWER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get list tasks is in progress of group'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessResponseDto<[TaskItemSuccess]>
    })
    async getTasksInProgress(
        @Param('groupId', ParseIntPipe) groupId: number,
        @Query() filter: FilterTask
    ): Promise<TaskItemSuccess[]> {
        return this.groupService.findByGroupIdAndStatus(groupId, filter, 'IN_PROGRESS');
    }

    @Get(':groupId/tasks/done')
    @UseGuards(JwtAuthGuard)
    @HasGroupRole(GroupRole.ADMIN, GroupRole.MEMBER, GroupRole.VIEWER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get list tasks is done of group'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessResponseDto<[TaskItemSuccess]>
    })
    async getTasksDone(
        @Param('groupId', ParseIntPipe) groupId: number,
        @Query() filter: FilterTask
    ): Promise<TaskItemSuccess[]> {
        return this.groupService.findByGroupIdAndStatus(groupId, filter, 'DONE');
    }

    @Get(':groupId')
    @UseGuards(JwtAuthGuard, GroupRoleGuard)
    @HasGroupRole(GroupRole.ADMIN, GroupRole.VIEWER, GroupRole.MEMBER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get group details by ID',
        description: 'Returns detailed information of a group that the current user has access to'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved group details',
        type: GroupDetailsSuccess
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Group not found',
        type: ErrorResponseDto
    })
    async getGroupDetails(
        @Param('groupId') groupId: string,
    ): Promise<GroupDetailsSuccess> {
        const groupIdNum = Number(groupId);
        if (isNaN(groupIdNum)) {
            throw new BaseException({
                code: ErrorCode.GROUP_MEMBER_NOT_FOUND,
                message: 'Invalid groupId',
                status: HttpStatus.FORBIDDEN,
            });
        }
        return this.groupService.getGroupById(groupIdNum);
    }

    @Get(':groupId/members/search')
    @UseGuards(JwtAuthGuard, GroupRoleGuard)
    @HasGroupRole(GroupRole.ADMIN, GroupRole.MEMBER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Search user by email in group",
        description: "Check if a user exists and whether they are a member of the group",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User found',
        type: SuccessResponseDto<UserSearchResultDto>,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User or group not found',
        type: ErrorResponseDto,
    })
    async findMemberByEmail(
        @Param('groupId') groupId: string,
        @Query() query: FindUserNotInGroupByEmail,
    ): Promise<UserSearchResultDto> {
        return this.groupService.findMemberInGroupByEmail(query, Number(groupId));
    }

    @Get(':groupId/members/me')
    @UseGuards(JwtAuthGuard, GroupRoleGuard)
    @HasGroupRole(GroupRole.ADMIN, GroupRole.MEMBER, GroupRole.VIEWER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Get me in group",
        description: "Get my information in group",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'My information found',
        type: SuccessResponseDto<MemberSearchResultDto>,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User or group not found',
        type: ErrorResponseDto,
    })
    async getMember(
        @Param('groupId', ParseIntPipe) groupId: number,
        @CurrentUser() user: CurrentUserPayload,
    ): Promise<MemberSearchResultDto> {
        return this.groupService.getMember(groupId, user.userId);
    }

    @Post(':groupId/members/:receiverId')
    @UseGuards(JwtAuthGuard, GroupRoleGuard)
    @HasGroupRole(GroupRole.ADMIN, GroupRole.MEMBER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send invitation to a user to join the group' })
    @ApiResponse({ status: 200, description: 'Invitation sent successfully', type: SuccessResponseDto<NotificationSuccess> })
    @ApiResponse({ status: 404, description: 'Group or user not found', type: ErrorResponseDto })
    @ApiResponse({ status: 400, description: 'Sender or receiver inactive', type: ErrorResponseDto })
    @ApiResponse({ status: 409, description: 'User is already a member', type: ErrorResponseDto })
    async sendInvitationMember(
        @CurrentUser() user: CurrentUserPayload,
        @Param('groupId') groupId: string,
        @Param('receiverId') receiverId: string,
    ): Promise<NotificationSuccess> {
        const senderId = user.userId;
        return this.groupService.invitedUser(Number(groupId), senderId, Number(receiverId));
    }

    @Post(':groupId/tasks')
    @UseGuards(JwtAuthGuard, GroupRoleGuard)
    @HasGroupRole(GroupRole.ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Create a new task for a group' })
    @ApiResponse({
        status: 200,
        description: 'Task created successfully',
        type: SuccessResponseDto<TaskCreatedSuccess>,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid request data or inactive user',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Group not found',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 409,
        description: 'Some assignees are already assigned to this task',
        type: ErrorResponseDto,
    })
    async createTask(
        @Param('groupId', ParseIntPipe) groupId: number,
        @Body() data: CreateTask
    ): Promise<TaskCreatedSuccess> {
        return this.taskService.create(groupId, data);
    }

    

    @Get(':groupId/tasks/count')
    @UseGuards(JwtAuthGuard, GroupRoleGuard)
    @HasGroupRole(GroupRole.ADMIN, GroupRole.MEMBER, GroupRole.VIEWER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Count tasks in group' })
    @ApiResponse({
        status: 200,
        description: 'Task statistics',
        type: SuccessResponseDto<CountTask>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Group is not found',
        type: ErrorResponseDto,
    })
    async countTask(
        @Param('groupId', ParseIntPipe) groupId: number,
    ): Promise<CountTask> {
        return this.groupService.countTask(groupId);
    }

    @Get(':groupId/tasks/:taskId')
    @UseGuards(JwtAuthGuard, GroupRoleGuard)
    @HasGroupRole(GroupRole.ADMIN, GroupRole.MEMBER, GroupRole.VIEWER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find a task for a group by id' })
    @ApiResponse({
        status: 200,
        description: 'Ok',
        type: SuccessResponseDto<TaskCreatedSuccess>,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'The group is not contains this task',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Task is not found',
        type: ErrorResponseDto,
    })
    async findTaskById(
        @Param('groupId', ParseIntPipe) groupId: number,
        @Param('taskId', ParseIntPipe) taskId: number,
    ): Promise<TaskCreatedSuccess> {
        return await this.taskService.getTaskById(groupId, taskId);
    }

    @Put(':groupId/tasks/:taskId')
    @UseGuards(JwtAuthGuard, GroupRoleGuard)
    @HasGroupRole(GroupRole.ADMIN, GroupRole.MEMBER)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a task for a group by id' })
    @ApiResponse({
        status: 200,
        description: 'Ok',
        type: SuccessResponseDto<TaskCreatedSuccess>,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'The group is not contains this task',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Task is not found',
        type: ErrorResponseDto,
    })
    async updateTask(
        @Param('groupId', ParseIntPipe) groupId: number,
        @Param('taskId', ParseIntPipe) taskId: number,
        @Body() data: UpdateTask
    ): Promise<TaskCreatedSuccess> {
        return this.taskService.update(groupId, taskId, data);
    }
}   