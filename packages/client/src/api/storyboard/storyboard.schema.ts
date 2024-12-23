import {
  CharacterResponse,
  CharacterStoryboardResponse,
  CreateSpokenVersionRequest,
  SpokenVersionResponse,
  StoryboardResponse,
  UpdateCharacterAppearanceUrlRequest,
  UpdateCharacterRequest,
  UpdateStoryboardRequest,
} from '@oxygen-admin/shared/dto';
import * as z from 'zod';

export const CreateSpokenVersionRequestSchema: z.ZodSchema<CreateSpokenVersionRequest> =
  z.object({
    storyId: z.string().trim().min(1, { message: '故事ID不能为空' }),
    writtenId: z.string().trim().min(1, { message: '翻译版本ID不能为空' }),
  });

export const UpdateCharacterRequestSchema: z.ZodSchema<UpdateCharacterRequest> =
  z.object({
    name: z.string().trim().min(1, { message: '角色名称不能为空' }).optional(),
    appearance: z
      .string()
      .trim()
      .min(1, { message: '角色外观描述不能为空' })
      .optional(),
  });

export const CharacterResponseSchema: z.ZodSchema<CharacterResponse> = z.object(
  {
    id: z.string().trim().min(1, { message: '[响应] 角色ID不能为空' }),
    projectId: z.string().trim().min(1, { message: '[响应] 项目ID不能为空' }),
    spokenId: z
      .string()
      .trim()
      .min(1, { message: '[响应] 口语版本ID不能为空' }),
    no: z.number(),
    name: z.string().trim().min(1, { message: '[响应] 角色名称不能为空' }),
    appearance: z
      .string()
      .trim()
      .min(1, { message: '[响应] 角色外观描述不能为空' }),
    appearanceUrl: z.nullable(z.string().trim().optional()),
  },
);

export const UpdateStoryboardRequestSchema: z.ZodSchema<UpdateStoryboardRequest> =
  z.object({
    no: z.number().optional(),
    cameraShot: z
      .string()
      .trim()
      .min(1, { message: '镜头描述不能为空' })
      .optional(),
    description: z
      .string()
      .trim()
      .min(1, { message: '场景描述不能为空' })
      .optional(),
    environment: z
      .string()
      .trim()
      .min(1, { message: '环境描述不能为空' })
      .optional(),
    voiceover: z.string().trim().optional(),
  });

export const StoryboardResponseSchema: z.ZodSchema<StoryboardResponse> =
  z.object({
    id: z.string().trim().min(1, { message: '[响应] 分镜ID不能为空' }),
    projectId: z.string().trim().min(1, { message: '[响应] 项目ID不能为空' }),
    spokenId: z
      .string()
      .trim()
      .min(1, { message: '[响应] 口语版本ID不能为空' }),
    no: z.number(),
    cameraShot: z
      .string()
      .trim()
      .min(1, { message: '[响应] 镜头描述不能为空' }),
    description: z
      .string()
      .trim()
      .min(1, { message: '[响应] 场景描述不能为空' }),
    environment: z
      .string()
      .trim()
      .min(1, { message: '[响应] 环境描述不能为空' }),
    voiceover: z.string().trim(),
  });

export const CharacterStoryboardResponseSchema: z.ZodSchema<CharacterStoryboardResponse> =
  z.object({
    characterId: z.string().trim().min(1, { message: '[响应] 角色ID不能为空' }),
    storyboardId: z
      .string()
      .trim()
      .min(1, { message: '[响应] 分镜ID不能为空' }),
  });

export const SpokenVersionResponseSchema: z.ZodSchema<SpokenVersionResponse | null> =
  z.nullable(
    z.object({
      id: z.string(),
      projectId: z.string(),
      writtenId: z.string(),
      title: z.string(),
      content: z.string(),
      version: z.number(),
      characters: z.array(CharacterResponseSchema),
      storyboards: z.array(StoryboardResponseSchema),
      characterStoryboards: z.array(CharacterStoryboardResponseSchema),
    }),
  );

export const UpdateCharacterAppearanceUrlRequestSchema: z.ZodSchema<UpdateCharacterAppearanceUrlRequest> =
  z.object({
    appearanceUrl: z
      .string()
      .trim()
      .min(1, { message: '角色外观图片URL不能为空' }),
  });
