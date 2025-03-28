import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/taskEndpoints";
import type { TaskStore } from "../taskStore";

export async function assignTask(this: TaskStore, taskId: number) {
	this.loading = true;
	this.error = null;
	try {
		const response = await taskEndpoints.assignTask(taskId);
		return response.data.data;
	} catch (error) {
		this.error = handleApiError(error);
		console.error("Error al asignar tarea:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
