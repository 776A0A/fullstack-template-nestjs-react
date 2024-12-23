import { Chapter } from '@/domain/project';
import { ChapterResponse as IChapterResponse } from '@oxygen-admin/shared/dto';
import { ApiProperty } from '@nestjs/swagger';

export class ChapterResponse implements IChapterResponse {
  @ApiProperty({ description: '章节ID' })
  id: string;

  @ApiProperty({ description: '章节标题' })
  title: string;

  @ApiProperty({ description: '章节顺序' })
  order: number;

  constructor(chapter: Chapter) {
    this.id = chapter.id();
    this.title = chapter.title();
    this.order = chapter.order();
  }
}
