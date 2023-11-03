import { ApiProperty } from '@nestjs/swagger';

enum Role {
  USER = 'USER',
}

export class UserDto {
  @ApiProperty({
    description: '인덱스',
    required: true,
    example: '1',
  })
  id!: number;

  @ApiProperty({
    description: 'role',
    required: true,
    example: Role.USER,
    enum: [Role.USER],
  })
  role!: string;

  @ApiProperty({
    description: '유저 아이디',
    required: true,
    example: 'test100',
  })
  userId!: string;

  @ApiProperty({ description: '이름', required: true, example: 'test100' })
  name!: string;

  @ApiProperty({
    description: '폰번호',
    required: true,
    example: '01012341234',
  })
  phone!: string;

  @ApiProperty({
    description: '폰번호',
    required: true,
    example: '+821012341234',
  })
  phone_e164?: string | null;

  @ApiProperty({
    description: '폰번호 인증 여부',
    required: true,
    example: 'true',
  })
  isPhoneVerified!: boolean;

  @ApiProperty({
    description: '생성일',
    required: true,
    example: '2023-11-01T11:43:03.388Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: '갱신일',
    required: true,
    example: '2023-11-01T11:43:03.388Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'access token',
    required: false,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RAdGVzdC5jb20iLCJzdWIiOnsibmFtZSI6InRlc3QifSwiaWF0IjoxNjk4OTA4MjMwLCJleHAiOjE2OTg5MDgyNTB9.pFlaje4swAi0PoLUvNa4vqvv4sdrVGewNezB1MW0gWY',
  })
  accessToken?: string;

  @ApiProperty({
    description: 'access token',
    required: false,
    example: '1698985883295',
  })
  expireIn?: number;
}
