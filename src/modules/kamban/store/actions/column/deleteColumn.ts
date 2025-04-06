import { handleApiError } from "@/util/handleApiError";
import * as columnEndpoints from "../../../endpoint/columnsEndpoint";
import type { ColumnStore } from "../../columnStore";

export async function deleteColumn(
	this: ColumnStore,
	boardId: number,
	columnId: number,
) {
	this.loading = true;
	this.error = null;

	try {
		await columnEndpoints.deleteColumn(boardId, columnId);

		// Eliminar del array de columnas
		this.columns = this.columns.filter((column) => column.id !== columnId);

		// Limpiar columna actual si es la misma
		if (this.currentColumn && this.currentColumn.id === columnId) {
			this.currentColumn = null;
		}

		return true;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(
			`Error al eliminar columna ${columnId} del tablero ${boardId}:`,
			error,
		);
		throw error;
	} finally {
		this.loading = false;
	}
}
