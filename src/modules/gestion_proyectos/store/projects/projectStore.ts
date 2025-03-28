import { handleApiError } from "@/util/handleApiError"; // ✅ Manejo centralizado de errores
// src/stores/projectStore.ts
import { defineStore } from "pinia";
import * as projectEndpoints from "../../endpoint/proyectsEndpoint"; // ✅ Corrección en el nombre de importación

export interface Project {
	id: number;
	name: string;
	description?: string;
	status?: string;
	user_id: number;
	created_at: string;
	updated_at: string;
}

export const useProjectStore = defineStore("project", {
	state: () => ({
		projects: [] as Project[],
		currentProject: null as Project | null,
		loading: false,
		error: null as string | null,
	}),

	actions: {
		async fetchProjects() {
			this.loading = true;
			this.error = null;
			try {
				const response = await projectEndpoints.getAllProjects();
				this.projects = response.data.data;
			} catch (error: unknown) {
				this.error = handleApiError(error);
				console.error("Error al obtener proyectos:", error);
			} finally {
				this.loading = false;
			}
		},

		async fetchProjectById(projectId: number) {
			this.loading = true;
			this.error = null;
			try {
				const response = await projectEndpoints.getProjectById(projectId);
				this.currentProject = response.data.data;
			} catch (error: unknown) {
				this.error = handleApiError(error);
				console.error("Error al obtener proyecto:", error);
			} finally {
				this.loading = false;
			}
		},

		async createProject(projectData: {
			name: string;
			description?: string;
			status?: string;
		}) {
			this.loading = true;
			this.error = null;
			try {
				const response = await projectEndpoints.createProject(projectData);
				const newProject = response.data.data;
				this.projects.push(newProject);
				return newProject;
			} catch (error: unknown) {
				this.error = handleApiError(error);
				console.error("Error al crear proyecto:", error);
				throw error;
			} finally {
				this.loading = false;
			}
		},

		async updateProject(
			projectId: number,
			projectData: { name?: string; description?: string; status?: string },
		) {
			this.loading = true;
			this.error = null;
			try {
				const response = await projectEndpoints.updateProject(
					projectId,
					projectData,
				);
				const updatedProject = response.data.data;
				const index = this.projects.findIndex((p) => p.id === projectId);
				if (index !== -1) {
					this.projects[index] = updatedProject;
				}
				if (this.currentProject?.id === projectId) {
					this.currentProject = updatedProject;
				}
				return updatedProject;
			} catch (error: unknown) {
				this.error = handleApiError(error);
				console.error("Error al actualizar proyecto:", error);
				throw error;
			} finally {
				this.loading = false;
			}
		},

		async deleteProject(projectId: number) {
			this.loading = true;
			this.error = null;
			try {
				await projectEndpoints.deleteProject(projectId);
				this.projects = this.projects.filter((p) => p.id !== projectId);
				if (this.currentProject?.id === projectId) {
					this.currentProject = null;
				}
			} catch (error: unknown) {
				this.error = handleApiError(error);
				console.error("Error al eliminar proyecto:", error);
				throw error;
			} finally {
				this.loading = false;
			}
		},
	},
});
