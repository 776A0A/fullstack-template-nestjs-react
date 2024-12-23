import {
  AddTagToProjectRequest,
  CreateProjectRequest,
  CreateProjectResponse,
  CreateTagRequest,
  LexileResponse,
  ProjectResponse,
  TagResponse,
  UpdateProjectRequest,
} from '@oxygen-admin/shared/dto';
import * as z from 'zod';

export const AddTagToProjectRequestSchema: z.ZodSchema<AddTagToProjectRequest> =
  z.object({
    tagId: z.string().trim().min(1, { message: '标签ID不能为空' }),
  });

export const TagResponseSchema: z.ZodSchema<TagResponse> = z.object({
  id: z.string().trim().min(1, { message: '[响应] 标签ID不能为空' }),
  value: z.string().trim().min(1, { message: '[响应] 标签值不能为空' }),
});

export const CreateProjectRequestSchema: z.ZodSchema<CreateProjectRequest> =
  z.object({
    name: z.string().trim().min(1, { message: '项目名称不能为空' }),
    lexileLevelId: z.string().trim().min(1, { message: '蓝思值ID不能为空' }),
    tags: z
      .array(z.string().trim().min(1, { message: '标签不能为空' }))
      .optional(),
  });

export type CreateProjectRequestType = z.infer<
  typeof CreateProjectRequestSchema
>;

export const CreateProjectResponseSchema: z.ZodSchema<CreateProjectResponse> =
  z.object({
    id: z.string().trim().min(1, { message: '[响应] 项目ID不能为空' }),
  });

export const UpdateProjectRequestSchema: z.ZodSchema<UpdateProjectRequest> =
  z.object({
    name: z.string().trim().min(1, { message: '项目名称不能为空' }),
  });

export const ProjectResponseSchema: z.ZodSchema<ProjectResponse> = z.object({
  id: z.string().trim().min(1, { message: '[响应] 项目ID不能为空' }),
  name: z.string().trim().min(1, { message: '[响应] 项目名称不能为空' }),
  userId: z.string().trim().min(1, { message: '[响应] 用户ID不能为空' }),
  lexileLevel: z.number(),
  tags: z.array(TagResponseSchema),
});

export const CreateTagRequestSchema: z.ZodSchema<CreateTagRequest> = z.object({
  value: z.string().trim().min(1, { message: '标签值不能为空' }),
});

export const CreateTagResponseSchema: z.ZodSchema<TagResponse> = z.object({
  id: z.string().trim().min(1, { message: '[响应] 标签ID不能为空' }),
  value: z.string().trim().min(1, { message: '[响应] 标签值不能为空' }),
});

export const LexileResponseSchema: z.ZodSchema<LexileResponse> = z.object({
  id: z.string().trim().min(1, { message: '[响应] 蓝思值ID不能为空' }),
  level: z.number(),
});
