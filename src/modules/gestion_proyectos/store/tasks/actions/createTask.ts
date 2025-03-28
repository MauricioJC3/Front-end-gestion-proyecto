import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/taskEndpoints";
import type { TaskStore } from "../taskStore";

export async function createTask(
	this: TaskStore,
	taskData: {
		tag_id: number;
		name: string;
		description?: string;
		due_date?: string;
	},
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await taskEndpoints.createTask(taskData);
		const newTask = response.data.data;
		this.tasks.push(newTask);
		return newTask;
	} catch (error) {
		this.error = handleApiError(error);
		console.error("Error al crear tarea:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
