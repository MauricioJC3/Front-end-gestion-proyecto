import { handleApiError } from "@/util/handleApiError";
import * as columnEndpoints from "../../../endpoint/columnsEndpoint";
import type { ColumnStore } from "../../columnStore";

export async function fetchColumns(this: ColumnStore, boardId: number) {
	if (!boardId && !this.boardId) {
		throw new Error("Se requiere un boardId para obtener las columnas");
	}

	const targetBoardId = boardId || this.boardId;
	this.loading = true;
	this.error = null;

	try {
		const response = await columnEndpoints.getAllColumns(targetBoardId);
		this.columns = response.data.data;
		if (!this.boardId) {
			this.boardId = targetBoardId;
		}
		return this.columns;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(
			`Error al obtener columnas del tablero ${targetBoardId}:`,
			error,
		);
		throw error;
	} finally {
		this.loading = false;
	}
}
