import { handleApiError } from "@/util/handleApiError";
import * as boardEndpoints from "../../../endpoint/boardsEndpoint";
import type { BoardStore } from "../../boardStore";

export async function updateBoard(
	this: BoardStore,
	boardId: number,
	boardData: {
		name?: string;
		description?: string;
	},
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await boardEndpoints.updateBoard(boardId, boardData);
		const updatedBoard = response.data.data;

		// Actualizar en el array de tableros
		const index = this.boards.findIndex((board) => board.id === boardId);
		if (index !== -1) {
			this.boards[index] = updatedBoard;
		}

		// Actualizar tablero actual si es el mismo
		if (this.currentBoard && this.currentBoard.id === boardId) {
			this.currentBoard = updatedBoard;
		}

		return updatedBoard;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(`Error al actualizar tablero ${boardId}:`, error);
		throw error;
	} finally {
		this.loading = false;
	}
}
