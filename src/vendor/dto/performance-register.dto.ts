import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

type StartAts = {
  id: number;
  startAt: string;
};

type Places = {
  id: number;
  city: string;
  place: string;
};

type SeatRanks = {
  id: number;
  seatRank: string;
  count: number;
  price: string;
};

type Floors = {
  id: number;
  floor: number;
};

type Sections = {
  id: number;
  section: string;
  floor: number;
};

type Columns = {
  id: number;
  section: string;
  floor: number;
  column: number;
  count: number;
  seatRank: string;
};

export class PerformanceRegisterDto {
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
    example: 'test100',
  })
  subtitle!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '연령', required: true, example: '19' })
  rating!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '공연시간',
    required: true,
    example: '120',
  })
  runningTime!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '공연 기간 (start)',
    required: true,
    example: '2023-01-01',
  })
  startDate!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '공연 기간 (end)',
    required: true,
    example: '2023-01-20',
  })
  endDate!: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '공연 시작 시간',
    required: true,
    example: `[
      {"id":0,"startAt":"12:00"},
      {"id":1,"startAt":"14:00"},
      {"id":2,"startAt":"16:00"}
    ]`,
  })
  startAts!: StartAts[];

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '공연 장소',
    required: true,
    example: `[
      {"id":0,"city":"서울","place":"잠실종합운동장"},
      {"id":1,"city":"대구","place":"대구종합운동장"}
    ]`,
  })
  places!: Places[];

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '좌석',
    required: true,
    example: `[
      {"id":0,"seatRank":"A","count":"100","price":"100,000"},
      {"id":1,"seatRank":"B","count":"100","price":"100,000"}
    ]`,
  })
  seatRanks!: SeatRanks[];

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '층',
    required: true,
    example: `[
      {"id":0,"floor":1},
      {"id":1,"floor":2}
    ]`,
  })
  floors!: Floors[];

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '구역',
    required: true,
    example: `[
      {"id":0,"section":"A","floor":1},
      {"id":1,"section":"B","floor":1},
      {"id":2,"section":"A","floor":2},
      {"id":3,"section":"B","floor":2}
    ]`,
  })
  sections!: Sections[];

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '열',
    required: true,
    example: `[
      {"id":0,"section":"A","floor":1,"column":1,"seats":"25","seatRank":"A"},
      {"id":1,"section":"A","floor":1,"column":2,"seats":"25","seatRank":"A"},
      {"id":4,"section":"A","floor":2,"column":1,"seats":"25","seatRank":"A"},
      {"id":5,"section":"A","floor":2,"column":2,"seats":"25","seatRank":"A"},
      {"id":2,"section":"B","floor":1,"column":1,"seats":"25","seatRank":"B"},
      {"id":3,"section":"B","floor":1,"column":2,"seats":"25","seatRank":"B"},
      {"id":6,"section":"B","floor":2,"column":1,"seats":"25","seatRank":"B"},
      {"id":7,"section":"B","floor":2,"column":2,"seats":"25","seatRank":"B"}
    ]`,
  })
  columns!: Columns[];
}
