import { handleApiError } from "@/util/handleApiError";
import * as boardEndpoints from "../../../endpoint/boardsEndpoint";
import type { BoardStore } from "../../boardStore";

export async function fetchBoardById(this: BoardStore, boardId: number) {
	this.loading = true;
	this.error = null;
	try {
		const response = await boardEndpoints.getBoardById(boardId);
		this.currentBoard = response.data.data;
		return this.currentBoard;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(`Error al obtener tablero ${boardId}:`, error);
		throw error;
	} finally {
		this.loading = false;
	}
}
