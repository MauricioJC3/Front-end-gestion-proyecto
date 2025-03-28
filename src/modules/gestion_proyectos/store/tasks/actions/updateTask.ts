import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/taskEndpoints";
import type { TaskStore } from "../taskStore";

export async function updateTask(
	this: TaskStore,
	taskId: number,
	taskData: {
		name?: string;
		description?: string;
		due_date?: string;
		completed?: boolean;
	},
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await taskEndpoints.updateTask(taskId, taskData);
		const updatedTask = response.data.data;
		const index = this.tasks.findIndex((t) => t.id === taskId);
		if (index !== -1) {
			this.tasks[index] = updatedTask;
		}
		if (this.currentTask?.id === taskId) {
			this.currentTask = updatedTask;
		}
		return updatedTask;
	} catch (error) {
		this.error = handleApiError(error);
		console.error("Error al actualizar tarea:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
