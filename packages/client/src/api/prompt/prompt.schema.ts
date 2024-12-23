import {
  PromptImageResponse,
  PromptResponse,
  UpdatePromptImageRequest,
  UpdatePromptRequest,
  UploadPromptImagesRequest,
} from '@oxygen-admin/shared/dto';
import * as z from 'zod';

export const UpdatePromptRequestSchema: z.ZodSchema<UpdatePromptRequest> =
  z.object({
    content: z.string().trim().min(1, { message: '提示词内容不能为空' }),
  });

export const PromptImageResponseSchema: z.ZodSchema<PromptImageResponse> =
  z.object({
    id: z.string().trim().min(1, { message: '[响应] 图片ID不能为空' }),
    projectId: z.string().trim().min(1, { message: '[响应] 项目ID不能为空' }),
    promptId: z.string().trim().min(1, { message: '[响应] 提示词ID不能为空' }),
    storyboardId: z
      .string()
      .trim()
      .min(1, { message: '[响应] 分镜ID不能为空' }),
    no: z.number(),
    url: z.string().trim().min(1, { message: '[响应] 图片URL不能为空' }),
  });

export const PromptResponseSchema: z.ZodSchema<PromptResponse> = z.object({
  id: z.string().trim().min(1, { message: '[响应] 提示词ID不能为空' }),
  projectId: z.string().trim().min(1, { message: '[响应] 项目ID不能为空' }),
  spokenId: z.string().trim().min(1, { message: '[响应] 口语版本ID不能为空' }),
  storyboardId: z.string().trim().min(1, { message: '[响应] 分镜ID不能为空' }),
  no: z.number(),
  content: z.string().trim().min(1, { message: '[响应] 提示词内容不能为空' }),
  promptImages: z.array(PromptImageResponseSchema),
});

const PromptImageDto = z.object({
  no: z.number(),
  url: z.string().trim().min(1, { message: '图片URL不能为空' }),
});

export const UploadPromptImagesRequestSchema: z.ZodSchema<UploadPromptImagesRequest> =
  z.object({
    images: z.array(PromptImageDto),
  });

export const UpdatePromptImageRequestSchema: z.ZodSchema<UpdatePromptImageRequest> =
  z.object({
    url: z.string().trim().min(1, { message: '图片URL不能为空' }),
  });
