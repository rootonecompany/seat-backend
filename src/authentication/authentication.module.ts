import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/utils/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserService, PrismaService, JwtService],
})
export class AuthenticationModule {}
