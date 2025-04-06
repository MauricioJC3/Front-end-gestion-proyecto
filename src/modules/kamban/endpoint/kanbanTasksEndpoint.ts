import api from "@/config";

export const getAllTasks = () => {
	return api.get("/kanban-tasks");
};

export const getTaskById = (taskId: number) => {
	return api.get(`/kanban-tasks/${taskId}`);
};

export const createTask = (data: {
	column_id: number;
	title: string;
	description?: string;
	position?: number;
	completed?: boolean;
	start_date?: string;
	due_date?: string;
}) => {
	return api.post("/kanban-tasks", data);
};

export const updateTask = (
	taskId: number,
	data: {
		column_id?: number;
		title?: string;
		description?: string;
		position?: number;
		completed?: boolean;
		start_date?: string;
		due_date?: string;
	},
) => {
	return api.put(`/kanban-tasks/${taskId}`, data);
};

export const deleteTask = (taskId: number) => {
	return api.delete(`/kanban-tasks/${taskId}`);
};
