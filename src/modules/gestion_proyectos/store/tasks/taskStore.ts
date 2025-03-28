import { defineStore } from "pinia";
import type { Task } from "../../interfaces/taskInterface";
import { assignTask } from "./actions/assignTask";
import { completeTask } from "./actions/completeTask";
import { createTask } from "./actions/createTask";
import { deleteTask } from "./actions/deleteTask";
import { fetchTaskById } from "./actions/fetchTaskById";
import { fetchTasksByTag } from "./actions/fetchTasksByTag";
import { updateTask } from "./actions/updateTask";

export const useTaskStore = defineStore("task", {
	state: () => ({
		tasks: [] as Task[],
		currentTask: null as Task | null,
		loading: false,
		error: null as string | null,
	}),

	actions: {
		fetchTasksByTag,
		fetchTaskById,
		createTask,
		updateTask,
		deleteTask,
		assignTask,
		completeTask,
	},
});

export type TaskStore = ReturnType<typeof useTaskStore>;
