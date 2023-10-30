import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserInfoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '유저 인덱스',
    required: true,
    example: '100',
  })
  private readonly id!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '유저 아이디',
    required: true,
    example: 'test100',
  })
  private readonly userId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '타입',
    required: false,
    example: false,
  })
  private readonly role!: string;
}
