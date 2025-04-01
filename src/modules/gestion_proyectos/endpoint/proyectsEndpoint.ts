import api from "@/config";

export const getAllProjects = () => {
	return api.get("/projects");
};

export const getProjectById = (projectId: number) => {
	return api.get(`/projects/${projectId}`);
};

export const createProject = (data: {
	name: string;
	description?: string;
	status?: string;
	start_date?: string; // Nueva propiedad
	due_date?: string; // Nueva propiedad
}) => {
	return api.post("/projects", data);
};

export const updateProject = (
	projectId: number,
	data: {
		name?: string;
		description?: string;
		status?: string;
		start_date?: string; // Nueva propiedad
		due_date?: string; // Nueva propiedad
	},
) => {
	return api.put(`/projects/${projectId}`, data);
};

export const deleteProject = (projectId: number) => {
	return api.delete(`/projects/${projectId}`);
};
