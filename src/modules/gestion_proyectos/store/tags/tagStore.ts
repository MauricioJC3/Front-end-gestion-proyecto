import { defineStore } from "pinia";
import type { Tag } from "../../interfaces/tagInterface";
import { createTag } from "./actions/createTag";
import { deleteTag } from "./actions/deleteTag";
import { fetchTagById } from "./actions/fetchTagById";
import { fetchTagsByProject } from "./actions/fetchTagsByProject";
import { updateTag } from "./actions/updateTag";

export const useTagStore = defineStore("tag", {
	state: () => ({
		tags: [] as Tag[],
		currentTag: null as Tag | null,
		loading: false,
		error: null as string | null,
	}),

	actions: {
		fetchTagsByProject,
		fetchTagById,
		createTag,
		updateTag,
		deleteTag,
	},
});

export type tagStore = ReturnType<typeof useTagStore>;
