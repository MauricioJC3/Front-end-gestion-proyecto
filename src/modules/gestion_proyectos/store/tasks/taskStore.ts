import { defineStore } from "pinia";
import type { Task } from "../../interfaces/taskInterface";
import { assignTask } from "./actions/assignTask";
import { completeTask } from "./actions/completeTask";
import { createTask } from "./actions/createTask";
import { deleteTask } from "./actions/deleteTask";
import { fetchTaskById } from "./actions/fetchTaskById";
import { fetchTasksByProject } from "./actions/fetchTasksByProject"; // Nueva acción
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
		fetchTasksByProject, // Agregamos la nueva acción
		fetchTaskById,
		createTask,
		updateTask,
		deleteTask,
		assignTask,
		completeTask,
	},

	// Agrega getters útiles
	getters: {
		getTasksByTagAndProject: (state) => (tagId: number, projectId: number) => {
			return state.tasks.filter(
				(task: Task) =>
					Number(task.tag_id) === Number(tagId) &&
					Number(task.project_id) === Number(projectId),
			);
		},
		getTasksByProject: (state) => (projectId: number) => {
			return state.tasks.filter(
				(task: Task) => Number(task.project_id) === Number(projectId),
			);
		},
	},
});

export type TaskStore = ReturnType<typeof useTaskStore>;
