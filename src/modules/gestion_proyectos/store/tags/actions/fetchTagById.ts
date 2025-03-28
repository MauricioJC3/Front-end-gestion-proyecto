import { handleApiError } from "@/util/handleApiError";
import * as tagEndpoints from "../../../endpoint/tagEndpoints";
import type { tagStore } from "../tagStore";

export async function fetchTagById(this: tagStore, tagId: number) {
	this.loading = true;
	this.error = null;
	try {
		const response = await tagEndpoints.getTagById(tagId);
		this.currentTag = response.data.data;
	} catch (error: unknown) {
		this.error = handleApiError(error);
	} finally {
		this.loading = false;
	}
}
