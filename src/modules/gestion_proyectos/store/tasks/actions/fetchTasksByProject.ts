import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/taskEndpoints";
import type { TaskStore } from "../taskStore";

export async function fetchTasksByProject(this: TaskStore, projectId: number) {
	this.loading = true;
	this.error = null;
	try {
		// Asume que tienes un endpoint para obtener tareas por proyecto
		// Si no lo tienes, necesitarás crearlo o agregar esta función a tu API
		const response = await taskEndpoints.getAllTasksByProject(projectId);

		const tasks = Array.isArray(response.data.data) ? response.data.data : [];

		// Actualiza solo las tareas para este proyecto, manteniendo las otras
		const otherTasks = this.tasks.filter(
			(task) => Number(task.project_id) !== Number(projectId),
		);
		this.tasks = [...otherTasks, ...tasks];

		console.log(
			`Cargadas ${tasks.length} tareas para el proyecto ${projectId}`,
		);

		return tasks;
	} catch (error) {
		this.error = handleApiError(error);
		console.error("Error al obtener tareas del proyecto:", error);
		return [];
	} finally {
		this.loading = false;
	}
}
