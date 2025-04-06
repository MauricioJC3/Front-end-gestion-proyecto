import { handleApiError } from "@/util/handleApiError";
import * as boardEndpoints from "../../../endpoint/boardsEndpoint";
import type { BoardStore } from "../../boardStore";

export async function deleteBoard(this: BoardStore, boardId: number) {
	this.loading = true;
	this.error = null;
	try {
		await boardEndpoints.deleteBoard(boardId);

		// Eliminar del array de tableros
		this.boards = this.boards.filter((board) => board.id !== boardId);

		// Limpiar tablero actual si es el mismo
		if (this.currentBoard && this.currentBoard.id === boardId) {
			this.currentBoard = null;
		}

		return true;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(`Error al eliminar tablero ${boardId}:`, error);
		throw error;
	} finally {
		this.loading = false;
	}
}
