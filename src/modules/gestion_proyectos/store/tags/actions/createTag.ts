import { handleApiError } from "@/util/handleApiError";
import * as tagEndpoints from "../../../endpoint/tagEndpoints";
import type { tagStore } from "../tagStore";

export async function createTag(
	this: tagStore,
	tagData: {
		project_id: number;
		name: string;
		color?: string;
	},
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await tagEndpoints.createTag(tagData);
		this.tags.push(response.data.data);
		return response.data.data;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		throw error;
	} finally {
		this.loading = false;
	}
}
