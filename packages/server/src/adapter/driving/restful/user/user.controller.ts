import { UpdateUserDto, UserService } from '@/application/user';
import { HttpResponse } from '@/common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    try {
      await this.userService.register({
        username: body.username,
        password: body.password,
      });
      return HttpResponse.success();
    } catch (error: any) {
      throw new BadRequestException(
        { message: error.message, code: HttpStatus.BAD_REQUEST },
        { cause: error },
      );
    }
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    try {
      const token = await this.userService.login({
        username: body.username,
        password: body.password,
      });
      return HttpResponse.success({ token });
    } catch (error: any) {
      throw new BadRequestException(
        { message: error.message, code: HttpStatus.BAD_REQUEST },
        { cause: error },
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
