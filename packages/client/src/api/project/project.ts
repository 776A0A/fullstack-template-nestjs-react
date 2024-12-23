import {
  CreateProjectRequest,
  CreateProjectResponse,
  CreateTagRequest,
  LexileResponse,
  ProjectResponse,
  TagResponse,
  UpdateProjectRequest,
} from '@oxygen-admin/shared/dto';
import { http } from '../utils';
import {
  CreateProjectResponseSchema,
  CreateTagRequestSchema,
  CreateTagResponseSchema,
  LexileResponseSchema,
  ProjectResponseSchema,
  TagResponseSchema,
} from './project.schema';

const API_PREFIX = '/projects';

export function getProjectList(): Promise<ProjectResponse[]> {
  return http.get({
    url: API_PREFIX,
    validateResponse: ProjectResponseSchema,
    isArray: true,
    name: 'getProjectList',
  });
}

export function getProject(id: string): Promise<ProjectResponse> {
  return http.get({
    url: `${API_PREFIX}/${id}`,
    validateResponse: ProjectResponseSchema,
    name: 'getProject',
  });
}

export function createProject(
  data: CreateProjectRequest,
): Promise<CreateProjectResponse> {
  return http.post({
    url: API_PREFIX,
    data,
    validateResponse: CreateProjectResponseSchema,
    name: 'createProject',
  });
}

export function updateProject(
  id: string,
  data: UpdateProjectRequest,
): Promise<void> {
  return http.put({
    url: `${API_PREFIX}/${id}`,
    data,
    name: 'updateProject',
  });
}

export function deleteProject(id: string): Promise<void> {
  return http.delete({
    url: `${API_PREFIX}/${id}`,
    name: 'deleteProject',
  });
}

export function addTagToProject(
  projectId: string,
  tagId: string,
): Promise<void> {
  return http.post({
    url: `${API_PREFIX}/${projectId}/tags`,
    data: { tagId },
    name: 'addTagToProject',
  });
}

export function removeTagFromProject(
  projectId: string,
  tagId: string,
): Promise<void> {
  return http.delete({
    url: `${API_PREFIX}/${projectId}/tags/${tagId}`,
    name: 'removeTagFromProject',
  });
}

export function getAllLexiles(): Promise<LexileResponse[]> {
  return http.get({
    url: '/lexiles',
    validateResponse: LexileResponseSchema,
    isArray: true,
    name: 'getAllLexiles',
  });
}

export function getAllTags(): Promise<TagResponse[]> {
  return http.get({
    url: '/tags',
    validateResponse: TagResponseSchema,
    isArray: true,
    name: 'getAllTags',
  });
}

export function createTag(data: CreateTagRequest): Promise<TagResponse> {
  return http.post({
    url: '/tags',
    data,
    validateRequest: CreateTagRequestSchema,
    validateResponse: CreateTagResponseSchema,
    name: 'createTag',
  });
}
