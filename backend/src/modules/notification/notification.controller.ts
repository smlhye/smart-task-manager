import { Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { NotificationService } from "./services/notification.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { NotificationItemSuccess, NotificationSuccess } from "./dto/response.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { FilterNotification } from "./dto/request.dto";
import { SuccessResponseDto } from "src/common/schemas/success-response.dto";
import type { CurrentUserPayload } from "../auth/strategies/jwt.strategy";

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get my notifications'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessResponseDto<[NotificationItemSuccess]>
    })
    async getMyGroups(
        @CurrentUser() user: CurrentUserPayload,
        @Query() filter: FilterNotification
    ): Promise<NotificationItemSuccess[]> {
        return this.notificationService.getMyNotifications(user.userId, filter);
    }

    @Get('unread/count')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get unread notification count'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Unread notification count',
        type: SuccessResponseDto<{ count: number }>
    })
    async getUnreadNotification(
        @CurrentUser() user: CurrentUserPayload,
    ): Promise<{ count: number }> {
        return this.notificationService.unreadCountByUserId(user.userId);
    }

    @Patch(':notificationId/read')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Mark notification as read'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Notification marked as read successfully',
        type: SuccessResponseDto
    })
    async markAsRead(
        @CurrentUser() user: CurrentUserPayload,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        return this.notificationService.markAsRead(notificationId, user.userId);
    }

    @Patch(':notificationId/accept')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Accept notification'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Notification accepted successfully',
        type: SuccessResponseDto
    })
    async acceptNotification(
        @CurrentUser() user: CurrentUserPayload,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        return this.notificationService.acceptNotification(notificationId, user.userId);
    }

    @Patch(':notificationId/reject')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Reject notification'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Notification rejected successfully',
        type: SuccessResponseDto
    })
    async rejectNotification(
        @CurrentUser() user: CurrentUserPayload,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        return this.notificationService.rejectNotification(notificationId, user.userId);
    }

    @Delete(':notificationId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete notification'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Notification deleted successfully',
        type: SuccessResponseDto
    })
    async deleteNotification(
        @CurrentUser() user: CurrentUserPayload,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        return this.notificationService.deleteNotification(notificationId, user.userId);
    }
}