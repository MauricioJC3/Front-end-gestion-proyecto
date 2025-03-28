import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/taskEndpoints";
import type { TaskStore } from "../taskStore";

export async function fetchTasksByTag(this: TaskStore, tagId: number) {
	this.loading = true;
	this.error = null;
	try {
		const response = await taskEndpoints.getAllTasksByTag(tagId);
		this.tasks = Array.isArray(response.data.data) ? response.data.data : [];
		return this.tasks;
	} catch (error) {
		this.error = handleApiError(error); // ✅ Uso del helper
		console.error("Error al obtener tareas:", error);
		return [];
	} finally {
		this.loading = false;
	}
}
