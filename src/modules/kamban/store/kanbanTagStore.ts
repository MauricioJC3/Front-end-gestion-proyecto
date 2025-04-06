import { defineStore } from "pinia";
import type { KanbanTag } from "../interfaces/kanbanInterfaces";
import { createTag } from "./actions/tag/createTag";
import { deleteTag } from "./actions/tag/deleteTag";
import { fetchTagById } from "./actions/tag/fetchTagById";
import { fetchTags } from "./actions/tag/fetchTags";
import { updateTag } from "./actions/tag/updateTag";

export const useKanbanTagStore = defineStore("kanbanTag", {
	state: () => ({
		tags: [] as KanbanTag[],
		currentTag: null as KanbanTag | null,
		loading: false,
		error: null as string | null,
	}),

	actions: {
		fetchTags,
		fetchTagById,
		createTag,
		updateTag,
		deleteTag,
	},
});

export type KanbanTagStore = ReturnType<typeof useKanbanTagStore>;
