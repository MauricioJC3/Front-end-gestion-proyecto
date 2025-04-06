import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/kanbanTasksEndpoint";
import type { KanbanTaskStore } from "../../kanbanTaskStore";

export async function fetchTaskById(this: KanbanTaskStore, taskId: number) {
	this.loading = true;
	this.error = null;

	try {
		const response = await taskEndpoints.getTaskById(taskId);
		this.currentTask = response.data.data;
		return this.currentTask;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(`Error al obtener tarea ${taskId}:`, error);
		throw error;
	} finally {
		this.loading = false;
	}
}
