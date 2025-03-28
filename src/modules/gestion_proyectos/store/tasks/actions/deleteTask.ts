import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/taskEndpoints";
import type { TaskStore } from "../taskStore";

export async function deleteTask(this: TaskStore, taskId: number) {
	this.loading = true;
	this.error = null;
	try {
		await taskEndpoints.deleteTask(taskId);
		this.tasks = this.tasks.filter((t) => t.id !== taskId);
		if (this.currentTask?.id === taskId) {
			this.currentTask = null;
		}
	} catch (error) {
		this.error = handleApiError(error);
		console.error("Error al eliminar tarea:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
