import { handleApiError } from "@/util/handleApiError";
import * as boardEndpoints from "../../../endpoint/boardsEndpoint";
import type { BoardStore } from "../../boardStore";

export async function fetchBoardDetails(this: BoardStore, boardId: number) {
	this.loading = true;
	this.error = null;
	try {
		const response = await boardEndpoints.getBoardDetails(boardId);
		this.currentBoardDetails = response.data.data;
		return this.currentBoardDetails;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(`Error al obtener detalles del tablero ${boardId}:`, error);
		throw error;
	} finally {
		this.loading = false;
	}
}
