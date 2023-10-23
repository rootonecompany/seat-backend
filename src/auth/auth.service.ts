import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auto.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const EXPIRE_TIME = 60 * 1000; // 60s

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    const payload = {
      email: user.email,
      sub: {
        name: user.name,
      },
    };

    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1m',
          secret: process.env.JWT_SECRET_KEY,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN_KEY,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async validateUser(dto: LoginDto) {
    const user = this.userService.findByEmail(dto.email);
    if (user && (await compare(dto.password, (await user).hashed_password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return user;
    }

    throw new UnauthorizedException('password is not correct!');
  }

  async refreshToken(user: any) {
    const payload = {
      email: user.email,
      name: user.name,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '5s',
        secret: process.env.JWT_SECRET_KEY,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_TOKEN_KEY,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

  async oAuthLogin({ request, response }) {
    console.log('oAuthLogin request', request);
    console.log('oAuthLogin response', response);
    const user = await this.userService.findByEmail(request.user.email);

    if (!user) {
      console.log('create user', user);
      // user = await this.userService.create({})
    }

    return user;
  }
}
