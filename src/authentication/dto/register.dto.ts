import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '유저 아이디',
    required: true,
    example: 'test100',
  })
  userId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '유저 비밀번호',
    required: true,
    example: 'test100',
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '이름', required: true, example: 'test100' })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '폰번호',
    required: true,
    example: '01012341234',
  })
  phone!: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '폰번호 인증 여부',
    required: true,
    example: true,
  })
  is_phone_verified!: boolean;
}
