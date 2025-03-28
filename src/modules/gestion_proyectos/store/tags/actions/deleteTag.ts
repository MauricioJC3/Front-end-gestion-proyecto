import { handleApiError } from "@/util/handleApiError";
import * as tagEndpoints from "../../../endpoint/tagEndpoints";
import type { tagStore } from "../tagStore";

export async function deleteTag(this: tagStore, tagId: number) {
	this.loading = true;
	this.error = null;
	try {
		await tagEndpoints.deleteTag(tagId);
		this.tags = this.tags.filter((t) => t.id !== tagId);
		if (this.currentTag?.id === tagId) {
			this.currentTag = null;
		}
	} catch (error: unknown) {
		this.error = handleApiError(error);
		throw error;
	} finally {
		this.loading = false;
	}
}
