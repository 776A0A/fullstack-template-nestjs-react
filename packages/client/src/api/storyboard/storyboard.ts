import {
  CreateSpokenVersionRequest,
  SpokenVersionResponse,
  UpdateCharacterRequest,
  UpdateStoryboardRequest,
} from '@oxygen-admin/shared/dto';
import { z } from 'zod';
import { http } from '../utils';
import {
  CreateSpokenVersionRequestSchema,
  SpokenVersionResponseSchema,
  UpdateCharacterRequestSchema,
  UpdateStoryboardRequestSchema,
} from './storyboard.schema';

const API_PREFIX = '/storyboards';

export function createSpokenVersion(
  data: CreateSpokenVersionRequest,
): Promise<SpokenVersionResponse> {
  return http.post({
    url: `${API_PREFIX}/spoken-versions`,
    data,
    validateRequest: CreateSpokenVersionRequestSchema,
    validateResponse:
      SpokenVersionResponseSchema as z.ZodSchema<SpokenVersionResponse>,
    name: 'createSpokenVersion',
  });
}

export function getSpokenVersionByProjectId(
  projectId: string,
): Promise<SpokenVersionResponse | null> {
  return http.get({
    url: `${API_PREFIX}/spoken-versions?projectId=${projectId}`,
    validateResponse: SpokenVersionResponseSchema,
    name: 'getSpokenVersionByProjectId',
  });
}

export function createCharacters(spokenId: string): Promise<void> {
  return http.post({
    url: `${API_PREFIX}/spoken-versions/${spokenId}/characters`,
    name: 'createCharacters',
  });
}

export function createStoryboards(spokenId: string): Promise<void> {
  return http.post({
    url: `${API_PREFIX}/spoken-versions/${spokenId}/storyboards`,
    name: 'createStoryboards',
  });
}

export function updateCharacterAppearanceUrl(
  characterId: string,
  appearanceUrl: string,
): Promise<void> {
  return http.put({
    url: `${API_PREFIX}/characters/${characterId}/appearance-url`,
    data: { appearanceUrl },
    name: 'updateCharacterAppearanceUrl',
  });
}

export function updateCharacter(
  spokenId: string,
  characterId: string,
  data: UpdateCharacterRequest,
): Promise<void> {
  return http.put({
    url: `${API_PREFIX}/spoken-versions/${spokenId}/characters/${characterId}`,
    data,
    validateRequest: UpdateCharacterRequestSchema,
    name: 'updateCharacter',
  });
}

export function updateStoryboard(
  spokenId: string,
  storyboardId: string,
  data: UpdateStoryboardRequest,
): Promise<void> {
  return http.put({
    url: `${API_PREFIX}/spoken-versions/${spokenId}/storyboards/${storyboardId}`,
    data,
    validateRequest: UpdateStoryboardRequestSchema,
    name: 'updateStoryboard',
  });
}
