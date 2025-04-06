import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/kanbanTasksEndpoint";
import type { KanbanTaskStore } from "../../kanbanTaskStore";

export async function deleteTask(this: KanbanTaskStore, taskId: number) {
	this.loading = true;
	this.error = null;

	try {
		await taskEndpoints.deleteTask(taskId);

		// Eliminar del array de tareas
		this.tasks = this.tasks.filter((task) => task.id !== taskId);

		// Limpiar tarea actual si es la misma
		if (this.currentTask && this.currentTask.id === taskId) {
			this.currentTask = null;
		}

		return true;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(`Error al eliminar tarea ${taskId}:`, error);
		throw error;
	} finally {
		this.loading = false;
	}
}
