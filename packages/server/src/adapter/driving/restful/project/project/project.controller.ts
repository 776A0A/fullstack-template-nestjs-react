import {
  AddChapterRequest,
  AddTagToProjectRequest,
  CreateProjectRequest,
  ProjectResponse,
  ProjectService,
  UpdateChapterRequest,
  UpdateProjectRequest,
} from '@/application/project';
import { JwtUser } from '@/application/user';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOperationResponse } from '@oxygen-admin/shared/dto';

@ApiTags('项目')
@Controller('v2/projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Post()
  @ApiOperation({ summary: '创建项目' })
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @JwtUser() userId: string,
    @Body() req: CreateProjectRequest,
  ): Promise<CreateOperationResponse> {
    return await this.service.createProject(userId, req);
  }

  @Put(':projectId')
  @ApiOperation({ summary: '更新项目' })
  @ApiParam({ name: 'projectId' })
  async updateProject(
    @JwtUser() userId: string,
    @Param('projectId') projectId: string,
    @Body() req: UpdateProjectRequest,
  ): Promise<void> {
    await this.service.updateProject(userId, projectId, req);
  }

  @Get()
  @ApiOperation({
    summary: '获取项目列表',
    description: '如果不传入userId, 则返回所有项目',
  })
  @ApiQuery({ name: 'userId', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [ProjectResponse] })
  async getProjectList(
    @Query('userId') userId?: string,
  ): Promise<ProjectResponse[]> {
    return await this.service.getProjectList(userId);
  }

  @Get(':projectId')
  @ApiOperation({ summary: '获取项目详情' })
  @ApiParam({ name: 'projectId' })
  @ApiResponse({ status: HttpStatus.OK, type: ProjectResponse })
  async getProject(
    @Param('projectId') projectId: string,
  ): Promise<ProjectResponse> {
    return await this.service.getProject(projectId);
  }

  @Delete(':projectId')
  @ApiOperation({ summary: '删除项目' })
  @ApiParam({ name: 'projectId' })
  async deleteProject(
    @JwtUser() userId: string,
    @Param('projectId') projectId: string,
  ): Promise<void> {
    await this.service.deleteProject(userId, projectId);
  }

  @Post(':projectId/chapters')
  @ApiOperation({ summary: '添加章节' })
  @ApiParam({ name: 'projectId' })
  @HttpCode(HttpStatus.CREATED)
  async addChapter(
    @JwtUser() userId: string,
    @Param('projectId') projectId: string,
    @Body() req: AddChapterRequest,
  ): Promise<CreateOperationResponse> {
    return await this.service.addChapter(userId, projectId, req);
  }

  @Put(':projectId/chapters/:chapterId')
  @ApiOperation({ summary: '更新章节' })
  @ApiParam({ name: 'projectId' })
  @ApiParam({ name: 'chapterId' })
  async updateChapter(
    @JwtUser() userId: string,
    @Param('projectId') projectId: string,
    @Param('chapterId') chapterId: string,
    @Body() req: UpdateChapterRequest,
  ): Promise<void> {
    await this.service.updateChapter(userId, projectId, chapterId, req);
  }

  @Delete(':projectId/chapters/:chapterId')
  @ApiOperation({ summary: '删除章节' })
  @ApiParam({ name: 'projectId' })
  @ApiParam({ name: 'chapterId' })
  async removeChapter(
    @JwtUser() userId: string,
    @Param('projectId') projectId: string,
    @Param('chapterId') chapterId: string,
  ): Promise<void> {
    await this.service.removeChapter(userId, projectId, chapterId);
  }

  @Post(':projectId/tags')
  @ApiOperation({ summary: '添加标签' })
  @ApiParam({ name: 'projectId' })
  @HttpCode(HttpStatus.CREATED)
  async addTagToProject(
    @JwtUser() userId: string,
    @Param('projectId') projectId: string,
    @Body() req: AddTagToProjectRequest,
  ): Promise<void> {
    await this.service.addTagToProject(userId, projectId, req.tagId);
  }

  @Delete(':projectId/tags/:tagId')
  @ApiOperation({ summary: '移除标签' })
  @ApiParam({ name: 'projectId' })
  @ApiParam({ name: 'tagId' })
  async removeTagFromProject(
    @JwtUser() userId: string,
    @Param('projectId') projectId: string,
    @Param('tagId') tagId: string,
  ): Promise<void> {
    await this.service.removeTagFromProject(userId, projectId, tagId);
  }
}
