import {
  ContentStyleResponse,
  CreateStoryRequest,
  StoryResponse,
  UpdateStoryRequest,
  UpdateStoryResponse,
} from '@oxygen-admin/shared/dto';
import { z } from 'zod';
import { http } from '../utils';
import {
  ContentStyleResponseSchema,
  StoryResponseSchema,
  UpdateStoryResponseSchema,
} from './story.schema';

const API_PREFIX = '/stories';

export function createStory(data: CreateStoryRequest): Promise<StoryResponse> {
  return http.post({
    url: API_PREFIX,
    data,
    validateResponse: StoryResponseSchema as z.ZodSchema<StoryResponse>,
    name: 'createStory',
  });
}

export function getStoryByProjectId(
  projectId: string,
): Promise<StoryResponse | null> {
  return http.get({
    url: `${API_PREFIX}?projectId=${projectId}`,
    validateResponse: StoryResponseSchema,
    name: 'getStoryByProjectId',
  });
}

export function updateStory(
  id: string,
  data: UpdateStoryRequest,
): Promise<UpdateStoryResponse> {
  return http.put({
    url: `${API_PREFIX}/${id}`,
    data,
    validateResponse: UpdateStoryResponseSchema,
    name: 'updateStory',
  });
}

export function getAllContentStyles(): Promise<ContentStyleResponse[]> {
  return http.get({
    url: '/content-styles',
    validateResponse: ContentStyleResponseSchema,
    isArray: true,
    name: 'getAllContentStyles',
  });
}

export function translateStory(id: string): Promise<void> {
  return http.post({
    url: `${API_PREFIX}/${id}/translate`,
    name: 'translateStory',
  });
}
