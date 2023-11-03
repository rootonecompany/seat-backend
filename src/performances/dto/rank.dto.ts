import { ApiProperty } from '@nestjs/swagger';

export class RankDto {
  @ApiProperty({
    description: '인덱스',
    required: true,
    example: '1',
  })
  id!: number;

  @ApiProperty({
    description: '장르',
    required: true,
    example: 'musical',
  })
  genre!: string;

  @ApiProperty({
    description: '타입 (힙합, 발라드 등)',
    required: true,
    example: 'musical',
  })
  type!: string;

  @ApiProperty({
    description: '이미지 URL',
    required: true,
    example:
      'https://tickets.interpark.com/contents/_next/image?url=https%3A%2F%2Fticketimage.interpark.com%2FPlay%2Fimage%2Flarge%2F23%2F23014423_p.gif&w=3840&q=75',
  })
  imageUrl!: string;

  @ApiProperty({
    description: '제목',
    required: true,
    example: '뮤지컬 〈몬테크리스토〉',
  })
  title!: string;

  @ApiProperty({
    description: '시작일',
    required: true,
    example: '2023.11.21',
  })
  startDate!: string;

  @ApiProperty({
    description: '종료일',
    required: true,
    example: '2024.2.25',
  })
  endDate!: string;

  @ApiProperty({
    description: '장소',
    required: true,
    example: '충무아트센터 대극장',
  })
  location!: string;

  @ApiProperty({
    description: '예매처',
    required: true,
    example: 'interpark',
  })
  distributor!: string;

  @ApiProperty({
    description: '생성일',
    required: true,
    example: '2023-11-03T01:23:39.570Z',
  })
  createdAt!: Date;
}
