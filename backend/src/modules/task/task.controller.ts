import { Controller, Get, HttpCode, HttpStatus, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SuccessResponseDto } from "src/common/schemas/success-response.dto";
import { CountTaskUser, TaskItemSuccess, TaskRecentItem } from "./dto/response.dto";
import { FilterTask } from "./dto/request.dto";
import { TaskService } from "./services/task.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { CurrentUserPayload } from "../auth/strategies/jwt.strategy";

@ApiTags('Task')
@Controller('tasks')
export class TaskController {
    constructor(
        private readonly taskService: TaskService,
    ) {}

    @Get('pending')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get list tasks is pending of user'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessResponseDto<[TaskItemSuccess]>
    })
    async getTasksPending(
        @CurrentUser() user: CurrentUserPayload,
        @Query() filter: FilterTask
    ): Promise<TaskItemSuccess[]> {
        return this.taskService.getMyTasks(user.userId, filter, 'PENDING');
    }

    @Get('in-progress')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get list tasks is in progress of user'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessResponseDto<[TaskItemSuccess]>
    })
    async getTasksInProgress(
        @CurrentUser() user: CurrentUserPayload,
        @Query() filter: FilterTask
    ): Promise<TaskItemSuccess[]> {
        return this.taskService.getMyTasks(user.userId, filter, 'IN_PROGRESS');
    }

    @Get('done')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get list tasks is done of user'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessResponseDto<[TaskItemSuccess]>
    })
    async getTasksDone(
        @CurrentUser() user: CurrentUserPayload,
        @Query() filter: FilterTask
    ): Promise<TaskItemSuccess[]> {
        return this.taskService.getMyTasks(user.userId, filter, 'DONE');
    }

    @Get('count')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get task count of current user',
        description: 'Returns the number of tasks grouped by status for the authenticated user'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessResponseDto<[CountTaskUser]>
    })
    async getCountTaskUser(
        @CurrentUser() user: CurrentUserPayload,
    ): Promise<CountTaskUser> {
        return this.taskService.countTaskUser(user.userId);
    }

    @Get('recent')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get tasks recent of current user',
        description: 'Returns the recent tasks for the authenticated user'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessResponseDto<[TaskRecentItem]>
    })
    async getRecentTasks(
        @CurrentUser() user: CurrentUserPayload,
    ): Promise<TaskRecentItem[]> {
        return this.taskService.getRecentTasks(user.userId);
    }
}
