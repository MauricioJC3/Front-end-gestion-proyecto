// src/stores/taskStore.ts
import { defineStore } from 'pinia';
import * as taskEndpoints from '../endpoint/taskEndpoints';

export interface Task {
  id: number;
  tag_id: number;
  name: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    currentTask: null as Task | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchTasksByTag(tagId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await taskEndpoints.getAllTasksByTag(tagId);
        this.tasks = Array.isArray(response.data.data) ? response.data.data : []; // ✅ Asegurar array
        return this.tasks;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch tasks';
        console.error('Error al obtener tareas:', error); // ✅ Debug
        return []; // ✅ Siempre devolver un array para evitar errores
      } finally {
        this.loading = false;
      }
    },

    async fetchTaskById(taskId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await taskEndpoints.getTaskById(taskId);
        this.currentTask = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch task';
        console.error('Error al obtener tarea:', error);
      } finally {
        this.loading = false;
      }
    },

    async createTask(taskData: { tag_id: number; name: string; description?: string; due_date?: string; }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await taskEndpoints.createTask(taskData);
        const newTask = response.data.data;
        this.tasks.push(newTask);
        return newTask;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create task';
        console.error('Error al crear tarea:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTask(taskId: number, taskData: { name?: string; description?: string; due_date?: string; completed?: boolean; }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await taskEndpoints.updateTask(taskId, taskData);
        const updatedTask = response.data.data;
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        if (this.currentTask?.id === taskId) {
          this.currentTask = updatedTask;
        }
        return updatedTask;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update task';
        console.error('Error al actualizar tarea:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTask(taskId: number) {
      this.loading = true;
      this.error = null;
      try {
        await taskEndpoints.deleteTask(taskId);
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        if (this.currentTask?.id === taskId) {
          this.currentTask = null;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete task';
        console.error('Error al eliminar tarea:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async completeTask(taskId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await taskEndpoints.completeTask(taskId);
        const completedTask = response.data.data;
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          this.tasks[index] = completedTask;
        }
        if (this.currentTask?.id === taskId) {
          this.currentTask = completedTask;
        }
        return completedTask;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to complete task';
        console.error('Error al completar tarea:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async assignTask(taskId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await taskEndpoints.assignTask(taskId);
        return response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to assign task';
        console.error('Error al asignar tarea:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
