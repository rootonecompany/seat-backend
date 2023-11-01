import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

type ConcertFiles = {
  path: string;
  type: string;
};

type StartAts = {
  startAt: string;
};

type Venues = {
  city: string;
  location: string;
};

type SeatRanks = {
  seatRank: string;
  count: number;
  price: number;
};

type Floors = {
  floor: number;
};

type Sections = {
  section: string;
  floor?: Floors;
};

type SeatColumns = {
  section?: Sections;
  floor?: Floors;
  column?: number;
  count: number;
  seatRank: string;
};

type SeatRows = {
  floor: Floors;
  isReserved: boolean;
  seatColumn: SeatColumns;
  seatNumber: number;
  section: Sections;
  userId: number | null;
};

export class ResponsePerformanceRegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '업로드된 이미지 경로와 타입',
    required: true,
    example: `[
      { "path": "...", "type": "main" },
      { "path": "...", "type": "detail" }
    ]`,
  })
  concertFiles!: ConcertFiles[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '제목',
    required: true,
    example: 'test',
  })
  title!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '부제목',
    required: true,
    example: 'test',
  })
  subtitle!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '연령', required: true, example: '19' })
  rating!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '공연시간',
    required: true,
    example: '120',
  })
  runningTime!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '공연 기간 (start)',
    required: true,
    example: '2023-11-01T00:00:00.000Z',
  })
  startDate!: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '공연 기간 (end)',
    required: true,
    example: '2023-11-30T00:00:00.000Z',
  })
  endDate!: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '공연 기간 (end)',
    required: true,
    example: '2023-11-01T12:30:58.690Z',
  })
  createdAt!: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '삭제 날짜',
    example: 'null',
    default: null,
  })
  deletedAt?: Date | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '삭제 여부',
    example: 'false',
    default: false,
  })
  isDeleted!: boolean;

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '공연 시작 시간',
    required: true,
    example: `[
      { "startAt": "12:00" },
      { "startAt": "14:00" },
      { "startAt": "16:00" }
    ]`,
  })
  startAts!: StartAts[];

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '공연 장소',
    required: true,
    example: `[
      { "city": "서울", "place": "잠실종합운동장" },
      { "city": "대구", "place": "대구종합운동장" }
    ]`,
  })
  venues!: Venues[];

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '좌석',
    required: true,
    example: `[
      { "seatRank": "A", "count": 100, "price": 100000 },
      { "seatRank": "B", "count": 100, "price": 100000 }
    ]`,
  })
  seatRanks!: SeatRanks[];

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '층',
    required: true,
    example: `[
      { "floor": 1 },
      { "floor": 2 }
    ]`,
  })
  floors!: Floors[];

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '구역',
    required: true,
    example: `[
      { "section": "A", "floor": { "floor": 1 } },
      { "section": "B", "floor": { "floor": 2 } },
      { "section": "A", "floor": { "floor": 1 } },
      { "section": "B", "floor": { "floor": 2 } }
    ]`,
  })
  sections!: Sections[];

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '열',
    required: true,
    example: `[
      { "section": { "section": "A" }, "floor": { "floor": 1 }, "column": 1, "seats": 25, "seatRank": "A" },
      { "section": { "section": "A" }, "floor": { "floor": 1 }, "column": 2, "seats": 25, "seatRank": "A" }
    ]`,
  })
  // { "section": { "section": "A" }, "floor": { "floor": 1 }, "column": 1, "seats": 25, "seatRank": "A" },
  // { "section": { "section": "A" }, "floor": { "floor": 1 }, "column": 2, "seats": 25, "seatRank": "A" },
  // { "section": { "section": "B" }, "floor": { "floor": 2 }, "column": 1, "seats": 25, "seatRank": "B" },
  // { "section": { "section": "B" }, "floor": { "floor": 2 }, "column": 2, "seats": 25, "seatRank": "B" },
  // { "section": { "section": "B" }, "floor": { "floor": 2 }, "column": 1, "seats": 25, "seatRank": "B" },
  // { "section": { "section": "B" }, "floor": { "floor": 2 }, "column": 2, "seats": 25, "seatRank": "B" }
  seatColumns!: SeatColumns[];

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '좌석',
    required: true,
    example: `[
      { "floor": { "floor": 1 }, "isReserved": false, "seatColumn": { "column": 1, "count": 25, "seatRank": "A" }, "seatNumber": 1, "section": { "section": "A" }, "userId": null },
      { "floor": { "floor": 1 }, "isReserved": false, "seatColumn": { "column": 1, "count": 25, "seatRank": "A" }, "seatNumber": 2, "section": { "section": "A" }, "userId": null }
    ]`,
  })
  //   { "floor": { "floor": 1 }, "isReserved": false, "seatColumn": { "column": 1, "count": 25, "seatRank": "A" }, "seatNumber": 3, "section": { "section": "A" }, "userId": null },
  //   { "floor": { "floor": 1 }, "isReserved": false, "seatColumn": { "column": 1, "count": 25, "seatRank": "A" }, "seatNumber": 4, "section": { "section": "A" }, "userId": null },
  //   { "floor": { "floor": 1 }, "isReserved": false, "seatColumn": { "column": 1, "count": 25, "seatRank": "A" }, "seatNumber": 5, "section": { "section": "A" }, "userId": null },
  //   { "floor": { "floor": 1 }, "isReserved": false, "seatColumn": { "column": 1, "count": 25, "seatRank": "A" }, "seatNumber": 6, "section": { "section": "A" }, "userId": null },
  //   { "floor": { "floor": 1 }, "isReserved": false, "seatColumn": { "column": 1, "count": 25, "seatRank": "A" }, "seatNumber": 7, "section": { "section": "A" }, "userId": null },
  //   { "floor": { "floor": 1 }, "isReserved": false, "seatColumn": { "column": 1, "count": 25, "seatRank": "A" }, "seatNumber": 8, "section": { "section": "A" }, "userId": null }
  seatRows!: SeatRows[];
}
