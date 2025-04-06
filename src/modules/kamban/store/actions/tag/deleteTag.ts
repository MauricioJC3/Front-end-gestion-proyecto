import { handleApiError } from "@/util/handleApiError";
import * as tagEndpoints from "../../../endpoint/kanbanTagsEndpoint";
import type { KanbanTagStore } from "../../kanbanTagStore";

export async function deleteTag(this: KanbanTagStore, tagId: number) {
	this.loading = true;
	this.error = null;

	try {
		await tagEndpoints.deleteTag(tagId);

		// Eliminar del array de etiquetas
		this.tags = this.tags.filter((tag) => tag.id !== tagId);

		// Limpiar etiqueta actual si es la misma
		if (this.currentTag && this.currentTag.id === tagId) {
			this.currentTag = null;
		}

		return true;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(`Error al eliminar etiqueta ${tagId}:`, error);
		throw error;
	} finally {
		this.loading = false;
	}
}
