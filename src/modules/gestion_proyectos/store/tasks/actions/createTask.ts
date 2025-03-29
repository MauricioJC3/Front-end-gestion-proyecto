import { handleApiError } from "@/util/handleApiError";
import * as taskEndpoints from "../../../endpoint/taskEndpoints";
import type { TaskStore } from "../taskStore";

export async function createTask(
	this: TaskStore,
	taskData: {
		tag_id: number;
		project_id: number; // Asegúrate de que project_id está siempre presente
		name: string;
		description?: string;
		due_date?: string;
	},
) {
	this.loading = true;
	this.error = null;
	try {
		// Convertir IDs a números para asegurar consistencia
		const normalizedData = {
			...taskData,
			tag_id: Number(taskData.tag_id),
			project_id: Number(taskData.project_id),
		};

		const response = await taskEndpoints.createTask(normalizedData);
		const newTask = response.data.data;

		// Asegúrate de que la tarea tenga el project_id correcto
		if (!newTask.project_id && normalizedData.project_id) {
			newTask.project_id = normalizedData.project_id;
		}

		// Agrega la nueva tarea al array de tareas
		this.tasks.push(newTask);
		console.log(
			`Tarea creada y agregada al store: ${newTask.name} (ID: ${newTask.id}, Proyecto: ${newTask.project_id})`,
		);

		return newTask;
	} catch (error) {
		this.error = handleApiError(error);
		console.error("Error al crear tarea:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
