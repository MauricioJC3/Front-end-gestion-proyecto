import { handleApiError } from "@/util/handleApiError";
import * as tagEndpoints from "../../../endpoint/tagEndpoints";
import type { tagStore } from "../tagStore";

export async function fetchTagsByProject(this: tagStore, projectId: number) {
	this.loading = true;
	this.error = null;
	try {
		const response = await tagEndpoints.getAllTagsByProject(projectId);
		this.tags = response.data.data;
	} catch (error: unknown) {
		this.error = handleApiError(error); // ✅ Manejo de error limpio
	} finally {
		this.loading = false;
	}
}
