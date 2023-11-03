import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { UserRegisterDto } from './dto/userRegister.dto';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({
    description: '회원가입 완료',
    type: UserDto,
  })
  async register(
    @Body() userRegisterDto: UserRegisterDto,
    @Res() res: Response,
  ) {
    const register = await this.authService.register(userRegisterDto);

    return res.status(HttpStatus.CREATED).json(register);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({
    type: UserDto,
  })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const login = await this.authService.login(loginDto);

    return res.status(HttpStatus.OK).json(login);
  }
}
