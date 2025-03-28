import { handleApiError } from "@/util/handleApiError";
import * as projectEndpoints from "../../../endpoint/proyectsEndpoint";
import type { ProjectStore } from "../projectStore";

export async function fetchProjects(this: ProjectStore) {
	this.loading = true;
	this.error = null;
	try {
		const response = await projectEndpoints.getAllProjects();
		this.projects = response.data.data;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al obtener proyectos:", error);
	} finally {
		this.loading = false;
	}
}
