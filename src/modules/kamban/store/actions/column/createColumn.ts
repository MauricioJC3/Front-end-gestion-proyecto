import { handleApiError } from "@/util/handleApiError";
import * as columnEndpoints from "../../../endpoint/columnsEndpoint";
import type { ColumnStore } from "../../columnStore";

export async function createColumn(
	this: ColumnStore,
	boardId: number,
	columnData: {
		name: string;
		position?: number;
	},
) {
	this.loading = true;
	this.error = null;
	try {
		const response = await columnEndpoints.createColumn(boardId, columnData);
		const newColumn = response.data.data;
		this.columns.push(newColumn);
		return newColumn;
	} catch (error: unknown) {
		this.error = handleApiError(error);
		console.error("Error al crear columna:", error);
		throw error;
	} finally {
		this.loading = false;
	}
}
