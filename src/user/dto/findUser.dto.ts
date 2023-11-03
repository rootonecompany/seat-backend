import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '아이디',
    required: false,
    example: 'test',
  })
  userId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '이름', required: false, example: 'test' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '폰번호',
    required: false,
    example: '01011111111',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '비밀번호',
    required: false,
    example: '01011111111',
  })
  password?: string;
}
