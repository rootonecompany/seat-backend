import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@Controller('authentication')
@ApiTags('인증 API')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ description: '회원가입 완료' })
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const register = await this.authService.register(registerDto);
    return res.status(HttpStatus.CREATED).json(register);
  }
}
