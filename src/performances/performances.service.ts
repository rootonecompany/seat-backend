import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class PerformancesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPerformances() {
    return await this.prisma.concert.findMany({
      include: {
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
        startAts: {
          select: {
            startAt: true,
          },
        },
      },
    });
  }

  async findAllPerformancesByGenre(genre: string) {
    return await this.prisma.concert.findMany({
      where: {
        genre,
      },
      include: {
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
        startAts: {
          select: {
            startAt: true,
          },
        },
      },
    });
  }
}
