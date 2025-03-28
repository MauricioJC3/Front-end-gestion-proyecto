import { defineStore } from "pinia";
import type { Project } from "../../interfaces/projectInterface";
import { createProject } from "./actions/createProject";
import { deleteProject } from "./actions/deleteProject";
import { fetchProjectById } from "./actions/fetchProjectById";
import { fetchProjects } from "./actions/fetchProjects";
import { updateProject } from "./actions/updateProject";

export const useProjectStore = defineStore("project", {
	state: () => ({
		projects: [] as Project[],
		currentProject: null as Project | null,
		loading: false,
		error: null as string | null,
	}),

	actions: {
		fetchProjects,
		fetchProjectById,
		createProject,
		updateProject,
		deleteProject,
	},
});

export type ProjectStore = ReturnType<typeof useProjectStore>;
