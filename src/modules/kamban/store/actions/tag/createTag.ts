import { handleApiError } from "@/util/handleApiError";
import * as tagEndpoints from "../../../endpoint/kanbanTagsEndpoint";
import type { KanbanTagStore } from "../../kanbanTagStore";

export async function createTag(
	this: KanbanTagStore,
	tagData: {
		board_id: number;
		name: string;
		color?: string;
	},
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await tagEndpoints.createTag(tagData);
		const newTag = response.data.data;
		this.tags.push(newTag);
		return newTag;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al crear etiqueta:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
