import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from "@nestjs/common";
import { GroupService } from "./services/group.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateGroupSuccess, GroupSuccess } from "./dto/response.dto";
import { CreateGroup, FilterGroup } from "./dto/request.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { CurrentUserPayload } from "../auth/strategies/jwt.strategy";

@ApiTags('Group')
@Controller('group')
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
    async register(
        @Body() data: CreateGroup,
        @CurrentUser() user: CurrentUserPayload,
    ): Promise<CreateGroupSuccess> {
        return this.groupService.create(data, user.userId);
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