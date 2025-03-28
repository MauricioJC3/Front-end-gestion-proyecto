import { handleApiError } from "@/util/handleApiError";
import * as projectEndpoints from "../../../endpoint/proyectsEndpoint";
import type { ProjectStore } from "../projectStore";

export async function updateProject(
	this: ProjectStore,
	projectId: number,
	projectData: { name?: string; description?: string; status?: string },
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await projectEndpoints.updateProject(
			projectId,
			projectData,
		);
		const updatedProject = response.data.data;
		const index = this.projects.findIndex((p) => p.id === projectId);
		if (index !== -1) {
			this.projects[index] = updatedProject;
		}
		if (this.currentProject?.id === projectId) {
			this.currentProject = updatedProject;
		}
		return updatedProject;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al actualizar proyecto:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
