import { handleApiError } from "@/util/handleApiError";
import * as tagEndpoints from "../../../endpoint/kanbanTagsEndpoint";
import type { KanbanTagStore } from "../../kanbanTagStore";

export async function fetchTags(this: KanbanTagStore) {
	this.loading = true;
	this.error = null;

	try {
		const response = await tagEndpoints.getAllTags();
		this.tags = response.data.data;
		return this.tags;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al obtener etiquetas:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
