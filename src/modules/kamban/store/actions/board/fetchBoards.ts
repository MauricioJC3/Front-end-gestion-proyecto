import { handleApiError } from "@/util/handleApiError";
import * as boardEndpoints from "../../../endpoint/boardsEndpoint";
import type { BoardStore } from "../../boardStore";

export async function fetchBoards(this: BoardStore) {
	this.loading = true;
	this.error = null;
	try {
		const response = await boardEndpoints.getAllBoards();
		this.boards = response.data.data;
		return this.boards;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al obtener tableros:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
