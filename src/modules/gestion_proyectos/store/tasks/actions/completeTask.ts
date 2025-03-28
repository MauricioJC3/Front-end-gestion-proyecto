import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/taskEndpoints";
import type { TaskStore } from "../taskStore";

export async function completeTask(this: TaskStore, taskId: number) {
	this.loading = true;
	this.error = null;
	try {
		const response = await taskEndpoints.completeTask(taskId);
		const completedTask = response.data.data;
		const index = this.tasks.findIndex((t) => t.id === taskId);
		if (index !== -1) {
			this.tasks[index] = completedTask;
		}
		if (this.currentTask?.id === taskId) {
			this.currentTask = completedTask;
		}
		return completedTask;
	} catch (error) {
		this.error = handleApiError(error);
		console.error("Error al completar tarea:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
