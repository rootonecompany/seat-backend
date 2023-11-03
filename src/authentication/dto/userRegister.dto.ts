import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '아이디',
    required: true,
    example: 'test',
  })
  userId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '아이디',
    required: true,
    example: 'test',
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '이름',
    required: true,
    example: 'test',
  })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '폰번호',
    required: true,
    example: '01011111111',
  })
  phone!: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '폰번호 인증 여부',
    required: true,
    example: 'true',
  })
  isPhoneVerified!: boolean;
}
