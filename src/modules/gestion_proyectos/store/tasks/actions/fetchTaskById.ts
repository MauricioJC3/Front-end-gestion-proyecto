import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/taskEndpoints";
import type { TaskStore } from "../taskStore";

export async function fetchTaskById(this: TaskStore, taskId: number) {
	this.loading = true;
	this.error = null;
	try {
		const response = await taskEndpoints.getTaskById(taskId);
		this.currentTask = response.data.data;
	} catch (error) {
		this.error = handleApiError(error);
		console.error("Error al obtener tarea:", error);
	} finally {
		this.loading = false;
	}
}
