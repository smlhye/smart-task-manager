export class TaskChangedEvent {
    constructor(
        public readonly groupId: number,
        public readonly groupName: string,
        public readonly taskId: number,
        public readonly assigneeIds: number[],
    ) { }
}