import api from "@/config";

export const getAllColumns = (boardId: number) => {
	return api.get(`/boards/${boardId}/columns`);
};

export const getColumnById = (boardId: number, columnId: number) => {
	return api.get(`/boards/${boardId}/columns/${columnId}`);
};

export const createColumn = (
	boardId: number,
	data: {
		name: string;
		position?: number;
	},
) => {
	return api.post(`/boards/${boardId}/columns`, data);
};

export const updateColumn = (
	boardId: number,
	columnId: number,
	data: {
		name?: string;
		position?: number;
	},
) => {
	return api.put(`/boards/${boardId}/columns/${columnId}`, data);
};

export const deleteColumn = (boardId: number, columnId: number) => {
	return api.delete(`/boards/${boardId}/columns/${columnId}`);
};
