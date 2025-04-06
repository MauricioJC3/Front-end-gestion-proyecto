import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/kanbanTasksEndpoint";
import type { KanbanTaskStore } from "../../kanbanTaskStore";

export async function fetchTasks(this: KanbanTaskStore) {
	this.loading = true;
	this.error = null;

	try {
		const response = await taskEndpoints.getAllTasks();
		this.tasks = response.data.data;
		return this.tasks;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al obtener tareas:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
