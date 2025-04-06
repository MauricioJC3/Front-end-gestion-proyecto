import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/kanbanTasksEndpoint";
import type { KanbanTaskStore } from "../../kanbanTaskStore";

export async function updateTask(
	this: KanbanTaskStore,
	taskId: number,
	taskData: {
		column_id?: number;
		title?: string;
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
		const response = await taskEndpoints.updateTask(taskId, taskData);
		const updatedTask = response.data.data;

		// Actualizar en el array de tareas
		const index = this.tasks.findIndex((task) => task.id === taskId);
		if (index !== -1) {
			this.tasks[index] = updatedTask;
		}

		// Actualizar tarea actual si es la misma
		if (this.currentTask && this.currentTask.id === taskId) {
			this.currentTask = updatedTask;
		}

		return updatedTask;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(`Error al actualizar tarea ${taskId}:`, error);
		throw error;
	} finally {
		this.loading = false;
	}
}
