import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { PerformanceDto } from './dto/performance.dto';
import { RankDto } from './dto/rank.dto';

@Injectable()
export class PerformancesService {
  private readonly logger = new Logger(PerformancesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAllPerformances(): Promise<PerformanceDto[]> {
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

  async findAllPerformancesByGenre(genre: string): Promise<PerformanceDto[]> {
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

  async findAllPerformanceRanks(): Promise<RankDto[]> {
    try {
      return await this.prisma.performanceRank.findMany({
        orderBy: {
          id: 'asc',
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAllPerformanceRanksByDistributor(
    distributor: string,
  ): Promise<RankDto[]> {
    return await this.prisma.performanceRank.findMany({
      where: {
        distributor,
      },
    });
  }

  async findAllPerformanceRanksByDistributorAndGenre(
    distributor: string,
    genre: string,
  ): Promise<RankDto[]> {
    return await this.prisma.performanceRank.findMany({
      where: {
        distributor,
        genre,
      },
    });
  }

  async findAllPerformanceRanksByDistributorAndGenreAndType(
    distributor: string,
    genre: string,
    type: string,
  ): Promise<RankDto[]> {
    return await this.prisma.performanceRank.findMany({
      where: {
        distributor,
        genre,
        type,
      },
    });
  }

  async findAllPerformanceRanksByGenre(genre: string): Promise<RankDto[]> {
    return await this.prisma.performanceRank.findMany({
      where: {
        genre,
      },
    });
  }

  async findAllPerformanceRanksByType(type: string): Promise<RankDto[]> {
    return await this.prisma.performanceRank.findMany({
      where: {
        type,
      },
    });
  }

  async findAllPerformanceRanksByGenreAndType(
    genre: string,
    type: string,
  ): Promise<RankDto[]> {
    return await this.prisma.performanceRank.findMany({
      where: {
        genre,
        type,
      },
    });
  }
}
