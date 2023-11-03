import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FindUserDto } from './dto/findUser.dto';
import { Response } from 'express';

@Controller('user')
@ApiTags('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('find/id')
  @ApiOperation({ summary: '아이디 찾기' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '이름',
          example: 'test',
        },
        phone: {
          type: 'string',
          description: '폰번호',
          example: '01011111111',
        },
      },
    },
  })
  @ApiOkResponse({ type: FindUserDto })
  async findId(@Body() findUserDto: FindUserDto, @Res() res: Response) {
    const user = await this.userService.findId(findUserDto);

    return res.status(HttpStatus.OK).json(user);
  }

  @Post('find/password')
  @ApiOperation({ summary: '비밀번호 찾기' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: '아이디',
          example: 'test',
        },
        name: {
          type: 'string',
          description: '이름',
          example: 'test',
        },
        phone: {
          type: 'string',
          description: '폰번호',
          example: '01011111111',
        },
      },
    },
  })
  @ApiOkResponse({ type: FindUserDto })
  async findPassword(@Body() findUserDto: FindUserDto, @Res() res: Response) {
    const user = await this.userService.findPassword(findUserDto);

    return res.status(HttpStatus.OK).json(user);
  }
}
