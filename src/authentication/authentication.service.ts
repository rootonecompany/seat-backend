import { UserService } from './../user/user.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/user/dto/user.dto';
import { UserRegisterDto } from './dto/userRegister.dto';
import { User } from '@prisma/client';

const EXPIRE_TIME = 60 * 60 * 1000; // 1h

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userRegisterDto: UserRegisterDto): Promise<UserDto> {
    const user = await this.userService.findByUserId(userRegisterDto.userId);

    if (user) {
      throw new ConflictException('이미 가입된 아이디입니다.');
    }

    return await this.userService.create(userRegisterDto);
  }

  async login(loginDto: LoginDto): Promise<UserDto> {
    const user = await this.validateUser(loginDto);

    const payload = {
      userId: user.userId,
      sub: {
        name: user.name,
      },
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET_KEY,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1y',
      secret: process.env.JWT_REFRESH_KEY,
    });

    const patchedUser = await this.userService.patchRefreshToken(
      user.id,
      refreshToken,
    );

    return {
      ...patchedUser,
      accessToken: accessToken,
      expireIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userService.findByUserId(loginDto.userId);

    if (user && (await compare(loginDto.password, user.hashedPassword))) {
      return user;
    }

    throw new UnauthorizedException('비밀번호가 틀립니다.');
  }
}
