import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/taskEndpoints";
import type { Task } from "../../../interfaces/taskInterface";
import type { TaskStore } from "../taskStore";

export async function fetchTasksByTag(
	this: TaskStore,
	tagId: number,
	projectId?: number,
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await taskEndpoints.getAllTasksByTag(tagId);

		// Asegúrate de que los datos estén en un formato de array
		let tasks: Task[] = Array.isArray(response.data.data)
			? response.data.data
			: [];
		if (projectId !== undefined) {
			tasks = tasks.filter(
				(task: Task) => Number(task.project_id) === Number(projectId),
			);
			console.log(
				`Filtrando tareas para tag ${tagId} y proyecto ${projectId}, encontradas: ${tasks.length}`,
			);
		}

		// Si no se proporciona projectId, actualiza todas las tareas
		// Si se proporciona, solo actualiza las tareas filtradas
		if (projectId !== undefined) {
			// Mantén las tareas que no pertenecen a esta etiqueta o proyecto
			const otherTasks = this.tasks.filter(
				(task) =>
					Number(task.tag_id) !== Number(tagId) ||
					Number(task.project_id) !== Number(projectId),
			);

			// Combina con las nuevas tareas
			this.tasks = [...otherTasks, ...tasks];
		} else {
			// Simplemente reemplaza todas las tareas para esta etiqueta
			const otherTasks = this.tasks.filter(
				(task) => Number(task.tag_id) !== Number(tagId),
			);
			this.tasks = [...otherTasks, ...tasks];
		}

		return tasks;
	} catch (error) {
		this.error = handleApiError(error);
		console.error("Error al obtener tareas:", error);
		return [];
	} finally {
		this.loading = false;
	}
}
