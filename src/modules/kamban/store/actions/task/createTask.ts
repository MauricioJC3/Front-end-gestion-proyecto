import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/kanbanTasksEndpoint";
import type { KanbanTaskStore } from "../../kanbanTaskStore";

export async function createTask(
	this: KanbanTaskStore,
	taskData: {
		column_id: number;
		title: string;
		description?: string;
		position?: number;
		completed?: boolean;
		start_date?: string;
		due_date?: string;
	},
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await taskEndpoints.createTask(taskData);
		const newTask = response.data.data;
		this.tasks.push(newTask);
		return newTask;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al crear tarea:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
