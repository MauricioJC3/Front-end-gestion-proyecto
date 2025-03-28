import { handleApiError } from "@/util/handleApiError";
import * as projectEndpoints from "../../../endpoint/proyectsEndpoint";
import type { ProjectStore } from "../projectStore";

export async function deleteProject(this: ProjectStore, projectId: number) {
	this.loading = true;
	this.error = null;
	try {
		await projectEndpoints.deleteProject(projectId);
		this.projects = this.projects.filter((p) => p.id !== projectId);
		if (this.currentProject?.id === projectId) {
			this.currentProject = null;
		}
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al eliminar proyecto:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
