import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/user-register.dto';
import { Response } from 'express';
import { ResponseRegisterDto } from './types/user-register.dto';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({
    description: '회원가입 완료',
    type: ResponseRegisterDto,
  })
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const register = await this.authService.register(registerDto);

    return res.status(HttpStatus.CREATED).json(register);
  }
}
