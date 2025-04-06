import { defineStore } from "pinia";
import type { KanbanTask } from "../interfaces/kanbanInterfaces";
import { createTask } from "./actions/task/createTask";
import { deleteTask } from "./actions/task/deleteTask";
import { fetchTaskById } from "./actions/task/fetchTaskById";
import { fetchTasks } from "./actions/task/fetchTasks";
import { updateTask } from "./actions/task/updateTask";

export const useKanbanTaskStore = defineStore("kanbanTask", {
	state: () => ({
		tasks: [] as KanbanTask[],
		currentTask: null as KanbanTask | null,
		loading: false,
		error: null as string | null,
	}),

	actions: {
		fetchTasks,
		fetchTaskById,
		createTask,
		updateTask,
		deleteTask,
	},
});

export type KanbanTaskStore = ReturnType<typeof useKanbanTaskStore>;
