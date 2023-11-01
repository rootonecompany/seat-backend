import { ApiProperty } from '@nestjs/swagger';

type ConcertFiles = {
  path: string;
};

type Venues = {
  city: string;
  location: string;
};

type SeatRows = {
  isReserved: boolean;
};

export class ResponsePerformanceDto {
  @ApiProperty({
    description: '인덱스',
    required: true,
    example: '1',
  })
  id!: number;

  @ApiProperty({
    description: '제목',
    required: true,
    example: 'test',
  })
  title!: string;

  @ApiProperty({
    description: '부제목',
    required: true,
    example: 'test',
  })
  subtitle!: string;

  @ApiProperty({
    description: '장르',
    required: true,
    example: 'concert',
  })
  genre!: string;

  @ApiProperty({
    description: '시작일',
    required: true,
    example: '2023-11-01T00:00:00.000Z',
  })
  startDate!: Date;

  @ApiProperty({
    description: '종료일',
    required: true,
    example: '2023-11-30T00:00:00.000Z',
  })
  endDate!: Date;

  @ApiProperty({
    description: '메인 이미지 업로드 경로',
    required: true,
    example: `[
      { "path": "..." }
    ]`,
  })
  concertFiles!: ConcertFiles[];

  @ApiProperty({
    description: '장소',
    required: true,
    example: `[
      { "city": "서울", "location": "잠실종합운동장" },
      { "city": "대구", "location": "대구종합운동장" }
    ]`,
  })
  venues!: Venues[];

  @ApiProperty({
    description: '좌석 여부 (프론트에서 count 확인)',
    required: true,
    example: `[
      { "isReserved": false },
      { "isReserved": false },
      { "isReserved": false }
    ]`,
  })
  seatRows!: SeatRows[];
}
