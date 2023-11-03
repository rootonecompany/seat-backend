import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/utils/prisma.service';
import { UserDto } from './dto/user.dto';
import { UserRegisterDto } from 'src/authentication/dto/userRegister.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { FindUserDto } from './dto/findUser.dto';
import crypto from 'crypto';

const EXPIRE_TIME = 60 * 60 * 1000; // 1h

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findByUserId(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        userId,
      },
    });
  }

  async create(userRegisterDto: UserRegisterDto): Promise<UserDto> {
    const user = await this.prisma.user.create({
      data: {
        userId: userRegisterDto.userId,
        hashedPassword: await hash(userRegisterDto.password, 10),
        name: userRegisterDto.name,
        phone: userRegisterDto.phone,
        isPhoneVerified: userRegisterDto.isPhoneVerified,
      },
      select: {
        id: true,
        role: true,
        userId: true,
        name: true,
        phone: true,
        phone_e164: true,
        isPhoneVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

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

    const patchedUser = await this.patchRefreshToken(user.id, refreshToken);

    return {
      ...patchedUser,
      accessToken: accessToken,
      expireIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

  async patchRefreshToken(id: number, refreshToken: string): Promise<UserDto> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshToken,
      },
    });
  }

  async findId(findUserDto: FindUserDto): Promise<FindUserDto> {
    return await this.prisma.user.findFirst({
      where: {
        name: findUserDto.name,
        phone: findUserDto.phone,
      },
      select: {
        userId: true,
      },
    });
  }

  async findPassword(findUserDto: FindUserDto): Promise<FindUserDto> {
    const tempPassword = crypto.randomBytes(20).toString('base64');

    await this.prisma.user.update({
      where: {
        userId: findUserDto.userId,
        name: findUserDto.name,
        phone: findUserDto.phone,
      },
      data: {
        hashedPassword: await hash(tempPassword, 10),
      },
    });

    return {
      password: tempPassword,
    };
  }
}
