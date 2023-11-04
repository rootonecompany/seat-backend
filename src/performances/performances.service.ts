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
    const performances = await this.prisma.performanceRank.findMany({
      where: {
        genre: '콘서트',
      },
      orderBy: {
        id: 'asc',
      },
    });

    const distributors = await this.prisma.performanceRank.groupBy({
      by: ['distributor'],
    });

    const filteredPerformances = [];

    for (let i = 0; i < distributors.length; i++) {
      const temp = {
        id: i + 1,
        name: distributors[i].distributor,
        ranking: [],
      };

      let k = 0;

      for (let j = 0; j < performances.length; j++) {
        if (distributors[i].distributor === performances[j].distributor) {
          temp.ranking.push({
            rank: k + 1,
            title: performances[j].title,
            date: `${performances[j].startDate.trim()} ~ ${performances[
              j
            ].endDate.trim()}`,
            image: performances[j].imageUrl,
          });

          k++;
        }
        continue;
      }

      filteredPerformances.push(temp);

      k = 0;
    }

    return filteredPerformances;
  }

  async findAllPerformanceRanksByDistributor(
    distributor: string,
  ): Promise<RankDto[]> {
    return await this.prisma.performanceRank.findMany({
      where: {
        distributor,
      },
      orderBy: {
        id: 'asc',
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
      orderBy: {
        id: 'asc',
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
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findAllPerformanceRanksByGenre(genre: string): Promise<RankDto[]> {
    return await this.prisma.performanceRank.findMany({
      where: {
        genre,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findAllPerformanceRanksByType(type: string): Promise<RankDto[]> {
    return await this.prisma.performanceRank.findMany({
      where: {
        type,
      },
      orderBy: {
        id: 'asc',
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
      orderBy: {
        id: 'asc',
      },
    });
  }
}
