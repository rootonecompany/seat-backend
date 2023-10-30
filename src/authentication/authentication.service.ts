import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { hash } from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: registerDto.userId,
      },
    });

    if (user) {
      throw new ConflictException('이미 가입된 아이디입니다.');
    }

    const newUser = await this.prisma.user.create({
      data: {
        userId: registerDto.userId,
        hashed_password: await hash(registerDto.password, 10),
        name: registerDto.name,
        phone: registerDto.phone,
        is_phone_verified: registerDto.is_phone_verified,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashed_password, ...rest } = newUser;
    return rest;
  }
}
