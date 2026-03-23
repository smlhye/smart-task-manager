import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { GroupService } from "./services/group.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateGroupSuccess, GroupSuccess } from "./dto/response.dto";
import { CreateGroup, FilterGroup, UpdateGroup } from "./dto/request.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { CurrentUserPayload } from "../auth/strategies/jwt.strategy";
import { HasGroupRole } from "./decorators/group-role.decorator";
import { GroupRole } from "@prisma/client";

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

    @Put(':id')
    @UseGuards(JwtAuthGuard)
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
        @Param('id') id: string,
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
}