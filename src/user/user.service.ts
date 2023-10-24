import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UserDto } from './dto/dto/user.dto';
import { hash } from 'bcrypt';
import { AccountDto } from './dto/dto/account.dto';
import { ProfileDto } from './dto/dto/profile.dto';
import { JwtService } from '@nestjs/jwt';

const EXPIRE_TIME = 60 * 60 * 1000; // 1m

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      throw new ConflictException('email duplicated');
    }

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        hashed_password: await hash(dto.password, 10),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashed_password, ...rest } = newUser;
    return rest;
  }

  async createUser(
    userDto: UserDto,
    accountDto: AccountDto,
    profileDto: ProfileDto,
  ) {
    const user = await this.prisma.user.create({
      data: {
        name: userDto.name.indexOf('*') !== -1 ? profileDto.name : userDto.name,
        email: userDto.email,
        // image: userDto.image,
        profiles: {
          create: {
            nickname: profileDto.nickname,
            thumbnail_image: profileDto.thumbnail_image,
            locale: profileDto.locale,
            given_name: profileDto.given_name,
            family_name: profileDto.family_name,
            is_email_valid: profileDto.is_email_valid,
            is_email_verified: profileDto.is_email_verified,
            age_range: profileDto.age_range,
            birthday: profileDto.birthday,
            gender: profileDto.gender,
            provider: accountDto.provider,
            providerAccountId: accountDto.providerAccountId,
            mobile: profileDto.mobile,
            mobile_e164: profileDto.mobile_e164,
            birthyear: profileDto.birthYear,
          },
        },
        accounts: {
          create: {
            type: accountDto.type,
            provider: accountDto.provider,
            providerAccountId: accountDto.providerAccountId,
            refresh_token: accountDto.refresh_token,
            access_token: accountDto.access_token,
            expires_at: accountDto.expires_at,
            refresh_token_expires_in: accountDto.refresh_token_expires_in,
            token_type: accountDto.token_type,
            scope: accountDto.scope,
            id_token: accountDto.id_token,
          },
        },
      },
      include: {
        accounts: true,
        profiles: true,
      },
    });

    const payload = {
      user,
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

  async createUserAnotherProfileAndAccount(
    id: number,
    accountDto: AccountDto,
    profileDto: ProfileDto,
  ) {
    await this.prisma.account.create({
      data: {
        type: accountDto.type,
        provider: accountDto.provider,
        providerAccountId: accountDto.providerAccountId,
        refresh_token: accountDto.refresh_token,
        access_token: accountDto.access_token,
        expires_at: accountDto.expires_at,
        refresh_token_expires_in: accountDto.refresh_token_expires_in,
        token_type: accountDto.token_type,
        scope: accountDto.scope,
        id_token: accountDto.id_token,
        userId: id,
      },
    });

    await this.prisma.profile.create({
      data: {
        nickname: profileDto.nickname,
        thumbnail_image: profileDto.thumbnail_image,
        locale: profileDto.locale,
        given_name: profileDto.given_name,
        family_name: profileDto.family_name,
        is_email_valid: profileDto.is_email_valid,
        is_email_verified: profileDto.is_email_verified,
        age_range: profileDto.age_range,
        birthday: profileDto.birthday,
        gender: profileDto.gender,
        provider: accountDto.provider,
        providerAccountId: accountDto.providerAccountId,
        userId: id,
        mobile: profileDto.mobile,
        mobile_e164: profileDto.mobile_e164,
        birthyear: profileDto.birthYear,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        accounts: {
          where: {
            provider: accountDto.provider,
          },
        },
        profiles: {
          where: {
            provider: accountDto.provider,
          },
        },
      },
    });

    const payload = {
      user,
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

  async userInfo(
    userDto: UserDto,
    accountDto: AccountDto,
    profileDto: ProfileDto,
  ) {
    console.log('userInfo userDto', userDto);
    console.log('userInfo accountDto', accountDto);
    console.log('userInfo profileDto', profileDto);

    const isUser = await this.prisma.user.findUnique({
      where: {
        email: userDto.email,
      },
      include: {
        accounts: {
          where: {
            provider: accountDto.provider,
          },
        },
        profiles: {
          where: {
            provider: accountDto.provider,
          },
        },
      },
    });
    console.log('userInfo isUser', isUser);

    let user;
    if (isUser) {
      user = await this.prisma.user.update({
        where: {
          id: isUser.id,
        },
        data: {
          name:
            userDto.name.indexOf('*') !== -1 ? profileDto.name : userDto.name,
          profiles: {
            update: {
              where: {
                id: isUser.profiles[0].id,
                provider: isUser.profiles[0].provider,
              },
              data: {
                thumbnail_image: profileDto.thumbnail_image,
                age_range: profileDto.age_range,
                birthday: profileDto.birthday,
                gender: profileDto.gender,
                birthyear: profileDto.birthYear,
                mobile: profileDto.mobile,
                mobile_e164: profileDto.mobile_e164,
                nickname: profileDto.nickname,
              },
            },
          },
          accounts: {
            update: {
              where: {
                id: isUser.accounts[0].id,
                provider: isUser.accounts[0].provider,
              },
              data: {
                type: accountDto.type,
                provider: accountDto.provider,
                providerAccountId: accountDto.providerAccountId,
                refresh_token: accountDto.refresh_token,
                access_token: accountDto.access_token,
                expires_at: accountDto.expires_at,
                refresh_token_expires_in: accountDto.refresh_token_expires_in,
                token_type: accountDto.token_type,
                scope: accountDto.scope,
                id_token: accountDto.id_token,
              },
            },
          },
        },
        include: {
          accounts: true,
          profiles: true,
        },
      });
    } else {
      user = null;
    }

    if (!user) {
      return null;
    }

    const payload = {
      user,
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

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        accounts: true,
        profiles: true,
      },
    });
  }

  async findByEmailAndProvider(email: string, provider: string) {
    const isUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isUser) {
      const isAccountAndProfile = await this.prisma.user.findFirst({
        where: {
          id: isUser.id,
        },
        include: {
          profiles: {
            where: {
              userId: isUser.id,
              provider,
            },
          },
          accounts: {
            where: {
              userId: isUser.id,
              provider,
            },
          },
        },
      });

      return isAccountAndProfile;
    } else {
      return null;
    }
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
