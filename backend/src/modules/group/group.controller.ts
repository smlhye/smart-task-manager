import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
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

@ApiTags('Group')
@Controller('groups')
export class GroupController {
    constructor(
        private readonly groupService: GroupService,
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
        @CurrentUser() user: CurrentUserPayload,
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
}