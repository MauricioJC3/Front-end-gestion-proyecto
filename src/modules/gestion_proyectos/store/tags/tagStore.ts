import { handleApiError } from "@/util/handleApiError";
// src/stores/tagStore.ts
import { defineStore } from "pinia";
import * as tagEndpoints from "../../endpoint/tagEndpoints";

export interface Tag {
	id: number;
	project_id: number;
	name: string;
	color?: string;
	created_at: string;
	updated_at: string;
}

export const useTagStore = defineStore("tag", {
	state: () => ({
		tags: [] as Tag[],
		currentTag: null as Tag | null,
		loading: false,
		error: null as string | null,
	}),

	actions: {
		async fetchTagsByProject(projectId: number) {
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
		},

		async fetchTagById(tagId: number) {
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
		},

		async createTag(tagData: {
			project_id: number;
			name: string;
			color?: string;
		}) {
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
		},

		async updateTag(tagId: number, tagData: { name?: string; color?: string }) {
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
		},

		async deleteTag(tagId: number) {
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
		},
	},
});
