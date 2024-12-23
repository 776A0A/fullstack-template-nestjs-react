// project

export interface CreateProjectRequest {
  title: string;
  lexileLevel: number;
  tagIds?: string[];
}

export interface UpdateProjectRequest {
  title: string;
}

export interface AddChapterRequest {
  title: string;
  order: number;
}

export interface UpdateChapterRequest {
  title?: string;
  order?: number;
}

export interface ProjectResponse {
  id: string;
  title: string;
  userId: string;
  lexileLevel: number;
  tags: TagResponse[];
  chapters: ChapterResponse[];
}

export interface ChapterResponse {
  id: string;
  title: string;
  order: number;
}

export interface AddTagToProjectRequest {
  tagId: string;
}

// tag

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name: string;
}

export interface TagResponse {
  id: string;
  name: string;
}
