import api from "@/config"; // contiene la url base de la API

export const getAllBoards = () => {
	return api.get("/boards");
};

export const getBoardById = (boardId: number) => {
	return api.get(`/boards/${boardId}`);
};

export const getBoardDetails = (boardId: number) => {
	return api.get(`/boards/${boardId}/details`);
};

export const createBoard = (data: {
	name: string;
	description?: string;
}) => {
	return api.post("/boards", data);
};

export const updateBoard = (
	boardId: number,
	data: {
		name?: string;
		description?: string;
	},
) => {
	return api.put(`/boards/${boardId}`, data);
};

export const deleteBoard = (boardId: number) => {
	return api.delete(`/boards/${boardId}`);
};
