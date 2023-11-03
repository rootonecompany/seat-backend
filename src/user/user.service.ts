import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/utils/prisma.service';
import { UserDto } from './dto/user.dto';
import { RegisterDto } from 'src/authentication/dto/register.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

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

  async create(registerDto: RegisterDto): Promise<UserDto> {
    const user = await this.prisma.user.create({
      data: {
        userId: registerDto.userId,
        hashedPassword: await hash(registerDto.password, 10),
        name: registerDto.name,
        phone: registerDto.phone,
        isPhoneVerified: registerDto.isPhoneVerified,
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
}
