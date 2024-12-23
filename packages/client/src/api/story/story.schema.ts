import {
  AddContentStyleToStoryRequest,
  ContentStyleResponse,
  CreateStoryRequest,
  StoryResponse,
  UpdateStoryRequest,
  UpdateStoryResponse,
  WrittenVersionResponse,
} from '@oxygen-admin/shared/dto';
import * as z from 'zod';

export const CreateStoryRequestSchema: z.ZodSchema<CreateStoryRequest> =
  z.object({
    projectId: z.string().trim().min(1, { message: '项目ID不能为空' }),
    title: z.string().trim().min(1, { message: '故事标题不能为空' }),
    content: z.string().trim().min(1, { message: '故事内容不能为空' }),
    contentStyleIds: z
      .array(z.string())
      .min(1, { message: '至少选择一个内容风格' }),
  });

export const AddContentStyleToStoryRequestSchema: z.ZodSchema<AddContentStyleToStoryRequest> =
  z.object({
    styleId: z.string().trim().min(1, { message: '内容风格ID不能为空' }),
  });

export const UpdateStoryRequestSchema: z.ZodSchema<UpdateStoryRequest> =
  z.object({
    title: z.string().trim().min(1, { message: '故事标题不能为空' }),
    content: z.string().trim().min(1, { message: '故事内容不能为空' }),
  });

export const UpdateStoryResponseSchema: z.ZodSchema<UpdateStoryResponse> =
  z.object({
    version: z.number(),
  });

export const WrittenVersionResponseSchema: z.ZodSchema<WrittenVersionResponse> =
  z.object({
    id: z.string().trim().min(1, { message: '[响应] 翻译版本ID不能为空' }),
    title: z.string().trim().min(1, { message: '标题不能为空' }),
    content: z.string().trim().min(1, { message: '内容不能为空' }),
    storyVersion: z.number(),
  });

export const ContentStyleResponseSchema: z.ZodSchema<ContentStyleResponse> =
  z.object({
    id: z.string().trim().min(1, { message: '[响应] 内容风格ID不能为空' }),
    value: z.string().trim().min(1, { message: '[响应] 内容风格值不能为空' }),
  });

export const StoryResponseSchema: z.ZodSchema<StoryResponse | null> =
  z.nullable(
    z.object({
      id: z.string().trim().min(1, { message: '[响应] 故事ID不能为空' }),
      projectId: z.string().trim().min(1, { message: '[响应] 项目ID不能为空' }),
      title: z.string().trim().min(1, { message: '[响应] 故事标题不能为空' }),
      content: z.string().trim().min(1, { message: '[响应] 故事内容不能为空' }),
      version: z.number(),
      contentStyles: z.array(ContentStyleResponseSchema),
      writtenVersion: WrittenVersionResponseSchema.optional(),
    }),
  );
