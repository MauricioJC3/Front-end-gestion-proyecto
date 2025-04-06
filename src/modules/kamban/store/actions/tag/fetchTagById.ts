import { handleApiError } from "@/util/handleApiError";
import * as tagEndpoints from "../../../endpoint/kanbanTagsEndpoint";
import type { KanbanTagStore } from "../../kanbanTagStore";

export async function fetchTagById(this: KanbanTagStore, tagId: number) {
	this.loading = true;
	this.error = null;

	try {
		const response = await tagEndpoints.getTagById(tagId);
		this.currentTag = response.data.data;
		return this.currentTag;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(`Error al obtener etiqueta ${tagId}:`, error);
		throw error;
	} finally {
		this.loading = false;
	}
}
