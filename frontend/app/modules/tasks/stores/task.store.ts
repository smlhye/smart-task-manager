import { create } from "zustand";
import { CreatedTaskType } from "../schemas/task.schema";

export type TaskMethod = "CREATE" | "UPDATE" | "VIEW";

type TaskStore = {
    task: CreatedTaskType | null;
    method: TaskMethod;

    groupId: number | null;

    setGroupId: (id?: number) => void;

    setTask: (task: CreatedTaskType) => void;
    setMethod: (method: TaskMethod) => void;

    reset: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    task: null,
    open: false,
    method: "VIEW",
    isDirty: false,
    groupId: null,

    setGroupId: (id?: number) =>
        set(() => ({
            groupId: id,
        })),

    setTask: (task) =>
        set(() => ({ task })),

    setMethod: (method) =>
        set(() => ({ method })),

    reset: () => {
        set(() => ({
            task: null,
            method: "VIEW",
        }))
    }
}))