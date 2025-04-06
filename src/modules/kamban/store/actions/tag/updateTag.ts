import { handleApiError } from "@/util/handleApiError";
import * as tagEndpoints from "../../../endpoint/kanbanTagsEndpoint";
import type { KanbanTagStore } from "../../kanbanTagStore";

export async function updateTag(
	this: KanbanTagStore,
	tagId: number,
	tagData: {
		name?: string;
		color?: string;
	},
) {
	this.loading = true;
	this.error = null;

	try {
		const response = await tagEndpoints.updateTag(tagId, tagData);
		const updatedTag = response.data.data;

		// Actualizar en el array de etiquetas
		const index = this.tags.findIndex((tag) => tag.id === tagId);
		if (index !== -1) {
			this.tags[index] = updatedTag;
		}

		// Actualizar etiqueta actual si es la misma
		if (this.currentTag && this.currentTag.id === tagId) {
			this.currentTag = updatedTag;
		}

		return updatedTag;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(`Error al actualizar etiqueta ${tagId}:`, error);
		throw error;
	} finally {
		this.loading = false;
	}
}
