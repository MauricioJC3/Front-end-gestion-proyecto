// src/api/endpoints/tagEndpoints.ts
import api from '@/config/base';

export const getAllTagsByProject = (projectId: number) => {
  return api.get(`/projects/${projectId}/tags`);
};

export const getTagById = (tagId: number) => {
  return api.get(`/tags/${tagId}`);
};

export const createTag = (data: {
  project_id: number;
  name: string;
  color?: string;
}) => {
  return api.post('/tags', data);
};

export const updateTag = (
  tagId: number, 
  data: {
    name?: string;
    color?: string;
  }
) => {
  return api.put(`/tags/${tagId}`, data);
};

export const deleteTag = (tagId: number) => {
  return api.delete(`/tags/${tagId}`);
};