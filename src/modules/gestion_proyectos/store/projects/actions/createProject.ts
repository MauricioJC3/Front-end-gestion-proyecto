import { handleApiError } from "@/util/handleApiError";
import * as projectEndpoints from "../../../endpoint/proyectsEndpoint";
import type { ProjectStore } from "../projectStore";

export async function createProject(
	this: ProjectStore,
	projectData: {
		name: string;
		description?: string;
		status?: string;
		start_date?: string; // Added new field
		due_date?: string; // Added new field
	},
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await projectEndpoints.createProject(projectData);
		const newProject = response.data.data;
		this.projects.push(newProject);
		return newProject;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al crear proyecto:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
