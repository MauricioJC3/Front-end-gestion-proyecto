import { handleApiError } from "@/util/handleApiError";
import * as columnEndpoints from "../../../endpoint/columnsEndpoint";
import type { ColumnStore } from "../../columnStore";

export async function updateColumn(
	this: ColumnStore,
	boardId: number,
	columnId: number,
	columnData: {
		name?: string;
		position?: number;
	},
) {
	this.loading = true;
	this.error = null;

	try {
		const response = await columnEndpoints.updateColumn(
			boardId,
			columnId,
			columnData,
		);
		const updatedColumn = response.data.data;

		// Actualizar en el array de columnas
		const index = this.columns.findIndex((column) => column.id === columnId);
		if (index !== -1) {
			this.columns[index] = updatedColumn;
		}

		// Actualizar columna actual si es la misma
		if (this.currentColumn && this.currentColumn.id === columnId) {
			this.currentColumn = updatedColumn;
		}

		return updatedColumn;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error(
			`Error al actualizar columna ${columnId} del tablero ${boardId}:`,
			error,
		);
		throw error;
	} finally {
		this.loading = false;
	}
}
