import {
  CreateTagRequest,
  TagResponse,
  TagService,
  UpdateTagRequest,
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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOperationResponse } from '@oxygen-admin/shared/dto';

@ApiTags('标签')
@Controller('v2/tags')
export class TagController {
  constructor(private readonly service: TagService) {}

  @Post()
  @ApiOperation({ summary: '创建标签' })
  @HttpCode(HttpStatus.CREATED)
  async createTag(
    @JwtUser() userId: string,
    @Body() req: CreateTagRequest,
  ): Promise<CreateOperationResponse> {
    return await this.service.createTag(userId, req);
  }

  @Put(':tagId')
  @ApiOperation({ summary: '更新标签' })
  @ApiParam({ name: 'tagId' })
  async updateTag(
    @JwtUser() userId: string,
    @Param('tagId') tagId: string,
    @Body() req: UpdateTagRequest,
  ): Promise<void> {
    await this.service.updateTag(userId, tagId, req);
  }

  @Delete(':tagId')
  @ApiOperation({ summary: '删除标签' })
  @ApiParam({ name: 'tagId' })
  async deleteTag(
    @JwtUser() userId: string,
    @Param('tagId') tagId: string,
  ): Promise<void> {
    await this.service.deleteTag(userId, tagId);
  }

  @Get(':tagId')
  @ApiOperation({ summary: '获取标签详情' })
  @ApiParam({ name: 'tagId' })
  @ApiResponse({ status: HttpStatus.OK, type: TagResponse })
  async getTag(@Param('tagId') tagId: string): Promise<TagResponse> {
    return await this.service.getTag(tagId);
  }

  @Get()
  @ApiOperation({ summary: '获取标签列表' })
  @ApiResponse({ status: HttpStatus.OK, type: [TagResponse] })
  async getTagList(): Promise<TagResponse[]> {
    return await this.service.getTagList();
  }
}
