import { handleApiError } from "@/util/handleApiError";
import * as columnEndpoints from "../../../endpoint/columnsEndpoint";
import type { ColumnStore } from "../../columnStore";

export async function fetchColumnById(
	this: ColumnStore,
	boardId: number,
	columnId: number,
) {
	this.loading = true;
	this.error = null;

	try {
		const response = await columnEndpoints.getColumnById(boardId, columnId);
		this.currentColumn = response.data.data;
		if (!this.boardId) {
			this.boardId = boardId;
		}
		return this.currentColumn;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(
			`Error al obtener columna ${columnId} del tablero ${boardId}:`,
			error,
		);
		throw error;
	} finally {
		this.loading = false;
	}
}
