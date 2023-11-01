import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { ResponsePerformanceDto } from './types/performance.dto';

@Injectable()
export class PerformancesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPerformances(): Promise<ResponsePerformanceDto[]> {
    return await this.prisma.concert.findMany({
      select: {
        id: true,
        title: true,
        subtitle: true,
        genre: true,
        startDate: true,
        endDate: true,
        concertFiles: {
          where: {
            type: 'main',
          },
          select: {
            path: true,
          },
        },
        venues: {
          select: {
            city: true,
            location: true,
          },
        },
        seatRows: {
          where: {
            isReserved: false,
          },
          select: {
            isReserved: true,
          },
        },
      },
    });
  }

  async findAllPerformancesByGenre(
    genre: string,
  ): Promise<ResponsePerformanceDto[]> {
    return await this.prisma.concert.findMany({
      where: {
        genre,
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        genre: true,
        startDate: true,
        endDate: true,
        concertFiles: {
          where: {
            type: 'main',
          },
          select: {
            path: true,
          },
        },
        venues: {
          select: {
            city: true,
            location: true,
          },
        },
        seatRows: {
          where: {
            isReserved: false,
          },
          select: {
            isReserved: true,
          },
        },
      },
    });
  }
}
