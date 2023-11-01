import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { RegisterDto } from './dto/user-register.dto';
import { hash } from 'bcrypt';
import { ResponseRegisterDto } from './types/user-register.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto): Promise<ResponseRegisterDto> {
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

    return newUser;
  }
}
