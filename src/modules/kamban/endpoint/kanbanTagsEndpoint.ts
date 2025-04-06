import api from "@/config";

export const getAllTags = () => {
	return api.get("/kanban-tags");
};

export const getTagById = (tagId: number) => {
	return api.get(`/kanban-tags/${tagId}`);
};

export const createTag = (data: {
	board_id: number;
	name: string;
	color?: string;
}) => {
	return api.post("/kanban-tags", data);
};

export const updateTag = (
	tagId: number,
	data: {
		name?: string;
		color?: string;
	},
) => {
	return api.put(`/kanban-tags/${tagId}`, data);
};

export const deleteTag = (tagId: number) => {
	return api.delete(`/kanban-tags/${tagId}`);
};
