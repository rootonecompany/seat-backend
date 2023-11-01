import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { PerformanceRegisterDto } from './dto/performance-register.dto';
import { ResponsePerformanceRegisterDto } from './types/performance-register.dto';

@Injectable()
export class VendorService {
  constructor(private readonly prisma: PrismaService) {}

  async register(
    files: {
      vendor_main_image: Express.Multer.File[];
      vendor_detail_image: Express.Multer.File[];
    },
    performanceRegisterDto: PerformanceRegisterDto,
  ): Promise<ResponsePerformanceRegisterDto> {
    const startAts = performanceRegisterDto.startAts.map((startAt) => {
      return {
        startAt: startAt.startAt,
      };
    });

    const venues = performanceRegisterDto.places.map((venue) => {
      return {
        city: venue.city,
        location: venue.place,
      };
    });

    const seatRanks = performanceRegisterDto.seatRanks.map((seatRank) => {
      return {
        seatRank: seatRank.seatRank,
        count: seatRank.count,
        price: Number(seatRank.price.replaceAll(',', '')),
      };
    });

    const floors = performanceRegisterDto.floors.map((floor) => {
      return {
        floor: floor.floor,
      };
    });

    const sections = performanceRegisterDto.sections.map((section) => {
      return {
        section: section.section,
        floorId: section.floor,
      };
    });

    const seatColumns = performanceRegisterDto.columns.map((seatColumn) => {
      return {
        sectionName: seatColumn.section,
        floorId: seatColumn.floor,
        column: seatColumn.column,
        count: seatColumn.count,
        seatRank: seatColumn.seatRank,
      };
    });

    const seatRows = this.seatRowArray(seatColumns);

    const register = await this.prisma.concert.create({
      data: {
        title: performanceRegisterDto.title,
        subtitle: performanceRegisterDto.subtitle,
        genre: 'concert',
        rating: Number(performanceRegisterDto.rating),
        runningTime: Number(performanceRegisterDto.runningTime),
        startDate: new Date(performanceRegisterDto.startDate),
        endDate: new Date(performanceRegisterDto.endDate),
        concertFiles: {
          createMany: {
            data: [
              {
                type: 'main',
                fieldName: files.vendor_main_image[0].fieldname,
                originalName: files.vendor_main_image[0].originalname,
                encoding: files.vendor_main_image[0].encoding,
                mimeType: files.vendor_main_image[0].mimetype,
                destination: files.vendor_main_image[0].destination,
                fileName: files.vendor_main_image[0].filename,
                path: files.vendor_main_image[0].path,
                size: files.vendor_main_image[0].size,
              },
              {
                type: 'detail',
                fieldName: files.vendor_detail_image[0].fieldname,
                originalName: files.vendor_detail_image[0].originalname,
                encoding: files.vendor_detail_image[0].encoding,
                mimeType: files.vendor_detail_image[0].mimetype,
                destination: files.vendor_detail_image[0].destination,
                fileName: files.vendor_detail_image[0].filename,
                path: files.vendor_detail_image[0].path,
                size: files.vendor_detail_image[0].size,
              },
            ],
          },
        },
        startAts: {
          createMany: {
            data: startAts,
          },
        },
        venues: {
          createMany: {
            data: venues,
          },
        },
        seatRanks: {
          createMany: {
            data: seatRanks,
          },
        },
        floors: {
          createMany: {
            data: floors,
          },
        },
        sections: {
          createMany: {
            data: sections,
          },
        },
        seatColumns: {
          createMany: {
            data: seatColumns,
          },
        },
        seatRows: {
          createMany: {
            data: seatRows,
          },
        },
      },
      include: {
        seatRanks: true,
        floors: true,
        sections: true,
        seatColumns: true,
        seatRows: {
          take: 10,
        },
      },
    });

    await this.updateRestNull(register);

    const concertInfo = await this.prisma.concert.findUnique({
      where: {
        id: 1,
      },
      include: {
        startAts: {
          select: {
            startAt: true,
          },
        },
        concertFiles: {
          select: {
            path: true,
            type: true,
          },
        },
        venues: {
          select: {
            city: true,
            location: true,
          },
        },
        seatRanks: {
          select: {
            seatRank: true,
            count: true,
            price: true,
          },
        },
        floors: {
          select: {
            floor: true,
          },
        },
        sections: {
          select: {
            section: true,
            floor: {
              select: {
                floor: true,
              },
            },
          },
        },
        seatColumns: {
          select: {
            column: true,
            count: true,
            seatRank: true,
            floor: {
              select: {
                floor: true,
              },
            },
            section: {
              select: {
                section: true,
              },
            },
          },
        },
        seatRows: {
          select: {
            seatNumber: true,
            userId: true,
            isReserved: true,
            floor: {
              select: {
                floor: true,
              },
            },
            section: {
              select: {
                section: true,
              },
            },
            seatColumn: {
              select: {
                column: true,
                count: true,
                seatRank: true,
              },
            },
          },
        },
      },
    });

    return concertInfo;
  }

  private seatRowArray(seatColumns) {
    return [].concat(
      ...seatColumns.map((seatColumn) => {
        const row = [];
        for (let i = 0; i < seatColumn.count; i++) {
          row.push({
            isReserved: false,
            seatNumber: i + 1,
            floorId: seatColumn.floorId,
            sectionName: seatColumn.sectionName,
            seatRankName: seatColumn.seatRank,
            seatColumnId: seatColumn.column,
          });
        }
        return row;
      }),
    );
  }

  private async updateRestNull(register) {
    await this.updateSeatColumn(register);
    await this.updateSeatRankId(register);
    await this.updateSectionId(register);
  }

  private async updateSeatColumn(register) {
    try {
      const findSection = await this.prisma.section.findMany({
        where: {
          concertId: register.id,
        },
      });

      await Promise.all(
        findSection.map(async (section) => {
          await this.prisma.seatColumn.updateMany({
            where: {
              concertId: register.id,
              sectionName: section.section,
              floorId: section.floorId,
            },
            data: {
              sectionId: section.id,
            },
          });
        }),
      );
    } catch (error) {
      console.log('===== error =====', error);
      throw new ServiceUnavailableException('update fail seatColumn');
    }
  }

  private async updateSeatRankId(register) {
    try {
      const findSeatRank = await this.prisma.seatRank.findMany({
        where: {
          concertId: register.id,
        },
      });

      await Promise.all(
        findSeatRank.map(async (seatRank) => {
          await this.prisma.seatRow.updateMany({
            where: {
              concertId: register.id,
              seatRankName: seatRank.seatRank,
            },
            data: {
              seatRankId: seatRank.id,
            },
          });
        }),
      );
    } catch (error) {
      console.log('===== error =====', error);
      throw new ServiceUnavailableException('update fail SeatRankId');
    }
  }

  private async updateSectionId(register) {
    try {
      const findSection = await this.prisma.section.findMany({
        where: {
          concertId: register.id,
        },
      });

      await Promise.all(
        findSection.map(async (section) => {
          await this.prisma.seatRow.updateMany({
            where: {
              concertId: register.id,
              sectionName: section.section,
              floorId: section.floorId,
            },
            data: {
              sectionId: section.id,
            },
          });
        }),
      );
    } catch (error) {
      console.log('===== error =====', error);
      throw new ServiceUnavailableException('update fail SeatColumnId');
    }
  }

  private async delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
