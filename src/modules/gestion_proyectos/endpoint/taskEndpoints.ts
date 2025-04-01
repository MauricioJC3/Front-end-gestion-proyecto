import api from "@/config";

export const getAllTasksByTag = (tagId: number) => {
	return api.get(`/tags/${tagId}/tasks`);
};

// Nueva función para obtener tareas por proyecto
export const getAllTasksByProject = (projectId: number) => {
	return api.get(`/projects/${projectId}/tasks`);
};

export const getTaskById = (taskId: number) => {
	return api.get(`/tasks/${taskId}`);
};

export const createTask = (data: {
	tag_id: number;
	project_id: number; // Agregado project_id aquí también
	name: string;
	description?: string;
	priority?: string; // Nueva propiedad
	start_date?: string; // Nueva propiedad
	due_date?: string; // Nueva propiedad
}) => {
	return api.post("/tasks", data);
};

export const updateTask = (
	taskId: number,
	data: {
		name?: string;
		description?: string;
		priority?: string; // Nueva propiedad
		start_date?: string; // Nueva propiedad
		due_date?: string; // Nueva propiedad
		completed?: boolean;
		project_id?: number; // Agregado project_id aquí también
		tag_id?: number;
	},
) => {
	return api.put(`/tasks/${taskId}`, data);
};

export const deleteTask = (taskId: number) => {
	return api.delete(`/tasks/${taskId}`);
};

export const completeTask = (taskId: number) => {
	return api.post(`/tasks/${taskId}/complete`);
};

export const assignTask = (taskId: number) => {
	return api.post(`/tasks/${taskId}/assign`);
};
