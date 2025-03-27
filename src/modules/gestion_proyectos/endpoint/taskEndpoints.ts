// src/api/endpoints/taskEndpoints.ts
import api from '@/config/base';

export const getAllTasksByTag = (tagId: number) => {
  return api.get(`/tags/${tagId}/tasks`);
};

export const getTaskById = (taskId: number) => {
  return api.get(`/tasks/${taskId}`);
};

export const createTask = (data: {
  tag_id: number;
  name: string;
  description?: string;
  due_date?: string;
}) => {
  return api.post('/tasks', data);
};

export const updateTask = (
  taskId: number, 
  data: {
    name?: string;
    description?: string;
    due_date?: string;
    completed?: boolean;
  }
) => {
  return api.put(`/tasks/${taskId}`, data);
};

export const deleteTask = (taskId: number) => {
  return api.delete(`/tasks/${taskId}`);
};

export const completeTask = (taskId: number) => {
  return api.post(`/tasks/${taskId}/complete`);
};

export const assignTask = (taskId: number) => {
  return api.post(`/tasks/${taskId}/assign`);
};