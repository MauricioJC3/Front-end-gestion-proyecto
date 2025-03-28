import { handleApiError } from "@/util/handleApiError";
import * as projectEndpoints from "../../../endpoint/proyectsEndpoint";
import type { ProjectStore } from "../projectStore";

export async function fetchProjectById(this: ProjectStore, projectId: number) {
	this.loading = true;
	this.error = null;
	try {
		const response = await projectEndpoints.getProjectById(projectId);
		this.currentProject = response.data.data;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al obtener proyecto:", error);
	} finally {
		this.loading = false;
	}
}
