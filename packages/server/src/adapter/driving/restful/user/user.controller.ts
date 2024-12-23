import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  UserService,
} from '@/application/user';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('用户')
@Controller('v2/users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() req: CreateUserRequest): Promise<void> {
    await this.service.createUser(req);
  }

  @Put(':userId')
  @ApiOperation({ summary: '更新用户' })
  @ApiParam({ name: 'userId' })
  async updateUser(
    @Param('userId') userId: string,
    @Body() req: UpdateUserRequest,
  ): Promise<void> {
    await this.service.updateUser(userId, req);
  }

  @Get(':userId')
  @ApiOperation({ summary: '获取用户详情' })
  @ApiParam({ name: 'userId' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  async getUser(@Param('userId') userId: string): Promise<UserResponse> {
    return await this.service.getUser(userId);
  }

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({ status: HttpStatus.OK, type: [UserResponse] })
  async getUserList(): Promise<UserResponse[]> {
    return await this.service.getUserList();
  }
}
