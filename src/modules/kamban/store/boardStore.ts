import { defineStore } from "pinia";
import type { Board, BoardDetails } from "../interfaces/kanbanInterfaces";
import { createBoard } from "./actions/board/createBoard";
import { deleteBoard } from "./actions/board/deleteBoard";
import { fetchBoardById } from "./actions/board/fetchBoardById";
import { fetchBoardDetails } from "./actions/board/fetchBoardDetails";
import { fetchBoards } from "./actions/board/fetchBoards";
import { updateBoard } from "./actions/board/updateBoard";

export const useBoardStore = defineStore("board", {
	state: () => ({
		boards: [] as Board[],
		currentBoard: null as Board | null,
		currentBoardDetails: null as BoardDetails | null,
		loading: false,
		error: null as string | null,
	}),

	actions: {
		fetchBoards,
		fetchBoardById,
		fetchBoardDetails,
		createBoard,
		updateBoard,
		deleteBoard,
	},
});

export type BoardStore = ReturnType<typeof useBoardStore>;
