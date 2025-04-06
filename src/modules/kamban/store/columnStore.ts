import { defineStore } from "pinia";
import type { Column } from "../interfaces/kanbanInterfaces";
import { createColumn } from "./actions/column/createColumn";
import { deleteColumn } from "./actions/column/deleteColumn";
import { fetchColumnById } from "./actions/column/fetchColumnById";
import { fetchColumns } from "./actions/column/fetchColumns";
import { updateColumn } from "./actions/column/updateColumn";

export const useColumnStore = defineStore("column", {
	state: () => ({
		columns: [] as Column[],
		currentColumn: null as Column | null,
		boardId: null as number | null,
		loading: false,
		error: null as string | null,
	}),

	actions: {
		fetchColumns,
		fetchColumnById,
		createColumn,
		updateColumn,
		deleteColumn,
		setBoardId(boardId: number) {
			this.boardId = boardId;
		},
	},
});

export type ColumnStore = ReturnType<typeof useColumnStore>;
