import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auto.dto';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async registerUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Req() request) {
    console.log('refreshToken request', request);
    return await this.authService.refreshToken(request.user);
  }

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() request: Request, @Res() response: Response) {
    console.log('loginGoogle request', request);
    console.log('loginGoogle response', response);
    this.authService.oAuthLogin({ request, response });
  }

  @Get('/login/google/callback')
  @UseGuards(AuthGuard('google'))
  async loginGoogleCallback(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log('loginGoogleCallback request', request);
    console.log('loginGoogleCallback response', response);
  }

  @Post('/userInfo')
  async userInfo(@Req() request: Request) {
    const user = request.body.user;
    const account = request.body.account;
    const profile = request.body.profile;
    // console.log('userInfo request.body', request.body);
    // console.log('userInfo user', user);
    // console.log('userInfo account', account);
    // console.log('userInfo profile', profile);

    const isUser = await this.userService.findByEmail(user.email);
    // console.log('userInfo isUser', isUser);

    if (!isUser) {
      const newProfile = {
        nickname:
          (profile?.properties?.nickname as string) ||
          (profile?.response?.nickname as string).indexOf('*') !== -1
            ? (profile?.response?.name as string)
            : (profile?.response?.nickname as string) || null,
        thumbnail_image:
          (profile?.properties?.thumbnail_image as string) ||
          (user?.image as string) ||
          (profile?.response?.profile_image as string) ||
          null,
        locale: (profile?.locale as string) || null,
        given_name: (profile?.given_name as string) || null,
        family_name: (profile?.family_name as string) || null,
        is_email_valid:
          (profile?.kakao_account?.is_email_valid as boolean) ||
          (profile?.email_verified as boolean) ||
          null,
        is_email_verified:
          (profile?.kakao_account?.is_email_verified as boolean) ||
          (profile?.email_verified as boolean) ||
          null,
        age_range:
          (profile?.kakao_account?.age_range as string) ||
          (profile?.response?.age as string) ||
          null,
        birthday:
          (profile?.kakao_account?.birthday as string) ||
          (profile?.response?.birthday as string) ||
          null,
        gender:
          (profile?.kakao_account?.gender as string) ||
          (profile?.response?.gender as string) === 'M'
            ? 'male'
            : 'female' || null,
        mobile: (profile?.response?.mobile as string) || null,
        mobile_e164: (profile?.response?.mobile_e164 as string) || null,
        birthYear: (profile?.response?.birthyear as string) || null,
        name: (profile?.response?.name as string) || null,
      };
      return await this.userService.createUser(user, account, newProfile);
    }

    const isUserWithProvider = await this.userService.findByEmailAndProvider(
      user.email,
      account.provider,
    );
    // console.log('userInfo isUserWithProvider', isUserWithProvider);

    if (
      isUserWithProvider.id &&
      isUserWithProvider.profiles.length === 0 &&
      isUserWithProvider.accounts.length === 0
    ) {
      const newProfile = {
        nickname:
          (profile?.properties?.nickname as string) ||
          (profile?.response?.nickname as string).indexOf('*') !== -1
            ? (profile?.response?.name as string)
            : (profile?.response?.nickname as string) || null,
        thumbnail_image:
          (profile?.properties?.thumbnail_image as string) ||
          (user?.image as string) ||
          (profile?.response?.profile_image as string) ||
          null,
        locale: (profile?.locale as string) || null,
        given_name: (profile?.given_name as string) || null,
        family_name: (profile?.family_name as string) || null,
        is_email_valid:
          (profile?.kakao_account?.is_email_valid as boolean) ||
          (profile?.email_verified as boolean) ||
          null,
        is_email_verified:
          (profile?.kakao_account?.is_email_verified as boolean) ||
          (profile?.email_verified as boolean) ||
          null,
        age_range:
          (profile?.kakao_account?.age_range as string) ||
          (profile?.response?.age as string) ||
          null,
        birthday:
          (profile?.kakao_account?.birthday as string) ||
          (profile?.response?.birthday as string) ||
          null,
        gender:
          (profile?.kakao_account?.gender as string) ||
          (profile?.response?.gender as string) === 'M'
            ? 'male'
            : 'female' || null,
        mobile: (profile?.response?.mobile as string) || null,
        mobile_e164: (profile?.response?.mobile_e164 as string) || null,
        birthYear: (profile?.response?.birthyear as string) || null,
        name: (profile?.response?.name as string) || null,
      };
      return await this.userService.createUserAnotherProfileAndAccount(
        isUserWithProvider.id,
        account,
        newProfile,
      );
    }

    return await this.userService.userInfo(user, account, profile);
  }
}
