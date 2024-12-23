import {
  PromptResponse,
  UpdatePromptImageRequest,
  UpdatePromptRequest,
  UploadPromptImagesRequest,
} from '@oxygen-admin/shared/dto';
import { http } from '../utils';
import {
  PromptResponseSchema,
  UploadPromptImagesRequestSchema,
} from './prompt.schema';

const API_PREFIX = '/prompts';

export function createPrompts(spokenId: string): Promise<void> {
  return http.post({
    url: `${API_PREFIX}/spoken-versions/${spokenId}/prompts`,
    name: 'createPrompts',
  });
}

export function updatePrompt(
  id: string,
  data: UpdatePromptRequest,
): Promise<PromptResponse> {
  return http.put({
    url: `${API_PREFIX}/${id}`,
    data,
    validateResponse: PromptResponseSchema,
    name: 'updatePrompt',
  });
}

export function removeImage(promptId: string, imageId: string): Promise<void> {
  return http.delete({
    url: `${API_PREFIX}/${promptId}/images/${imageId}`,
    name: 'removeImage',
  });
}

export function getPrompt(id: string): Promise<PromptResponse> {
  return http.get({
    url: `${API_PREFIX}/${id}`,
    validateResponse: PromptResponseSchema,
    name: 'getPrompt',
  });
}

export function getPromptsByStoryboardId(
  storyboardId: string,
): Promise<PromptResponse[]> {
  return http.get({
    url: `${API_PREFIX}/storyboards/${storyboardId}`,
    validateResponse: PromptResponseSchema,
    isArray: true,
    name: 'getPromptsByStoryboardId',
  });
}

export function getPromptsBySpokenId(
  spokenId: string,
): Promise<PromptResponse[]> {
  return http.get({
    url: `${API_PREFIX}/spoken-versions/${spokenId}`,
    validateResponse: PromptResponseSchema,
    isArray: true,
    name: 'getPromptsBySpokenId',
  });
}

export function uploadImages(
  id: string,
  data: UploadPromptImagesRequest,
): Promise<void> {
  return http.post({
    url: `${API_PREFIX}/${id}/upload-images`,
    data,
    validateRequest: UploadPromptImagesRequestSchema,
    name: 'uploadImages',
  });
}

export function updateImage(
  promptId: string,
  imageId: string,
  data: UpdatePromptImageRequest,
): Promise<PromptResponse> {
  return http.put({
    url: `${API_PREFIX}/${promptId}/images/${imageId}`,
    data,
    validateResponse: PromptResponseSchema,
    name: 'updateImage',
  });
}
