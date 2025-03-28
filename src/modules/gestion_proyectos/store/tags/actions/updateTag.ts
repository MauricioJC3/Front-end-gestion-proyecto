import { handleApiError } from "@/util/handleApiError";
import * as tagEndpoints from "../../../endpoint/tagEndpoints";
import type { tagStore } from "../tagStore";

export async function updateTag(
	this: tagStore,
	tagId: number,
	tagData: { name?: string; color?: string },
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await tagEndpoints.updateTag(tagId, tagData);
		const updatedTag = response.data.data;
		const index = this.tags.findIndex((t) => t.id === tagId);
		if (index !== -1) {
			this.tags[index] = updatedTag;
		}
		if (this.currentTag?.id === tagId) {
			this.currentTag = updatedTag;
		}
		return updatedTag;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		throw error;
	} finally {
		this.loading = false;
	}
}
