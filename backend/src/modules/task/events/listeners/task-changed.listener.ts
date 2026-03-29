import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskChangedEvent } from '../task-changed.event';
import { NotificationService } from 'src/modules/notification/services/notification.service';

@Injectable()
export class TaskChangedListener {
    constructor(
        private readonly notificationService: NotificationService,
    ) { }
    @OnEvent('task.changed')
    async handle(event: TaskChangedEvent) {
        for (const id of event.assigneeIds) {

            this.notificationService.createNotification(
                id,
                event.groupId,
                `Bạn vừa được thêm nhiệm vụ trong nhóm: ${event.groupName}`,
                event.taskId,
            )
        }
    }
}