import { handleApiError } from "@/util/handleApiError";
import * as boardEndpoints from "../../../endpoint/boardsEndpoint";
import type { BoardStore } from "../../boardStore";

export async function createBoard(
	this: BoardStore,
	boardData: {
		name: string;
		description?: string;
	},
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await boardEndpoints.createBoard(boardData);
		const newBoard = response.data.data;
		this.boards.push(newBoard);
		return newBoard;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al crear tablero:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
