import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { PerformanceDto } from './dto/performance.dto';
import { VendorRegisterDto } from './dto/vendorRegister.dto';

@Injectable()
export class VendorService {
  private readonly logger = new Logger(VendorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async register(
    vendorRegisterDto: VendorRegisterDto,
  ): Promise<PerformanceDto> {
    const startAts = vendorRegisterDto.startAts.map((startAt) => {
      return {
        startAt: startAt.startAt,
      };
    });

    const venues = vendorRegisterDto.places.map((venue) => {
      return {
        city: venue.city,
        location: venue.place,
      };
    });

    const seatRanks = vendorRegisterDto.seatRanks.map((seatRank) => {
      return {
        seatRank: seatRank.seatRank,
        count: seatRank.count,
        price: Number(seatRank.price.replaceAll(',', '')),
      };
    });

    const floors = vendorRegisterDto.floors.map((floor) => {
      return {
        floor: floor.floor,
      };
    });

    const sections = vendorRegisterDto.sections.map((section) => {
      return {
        section: section.section,
        floorId: section.floor,
      };
    });

    const seatColumns = vendorRegisterDto.columns.map((seatColumn) => {
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
        title: vendorRegisterDto.title,
        subtitle: vendorRegisterDto.subtitle,
        genre: 'concert',
        rating: Number(vendorRegisterDto.rating),
        runningTime: Number(vendorRegisterDto.runningTime),
        startDate: new Date(vendorRegisterDto.startDate),
        endDate: new Date(vendorRegisterDto.endDate),
        concertFiles: {
          createMany: {
            data: [
              {
                type: 'main',
                fieldName: vendorRegisterDto.vendor_main_image[0].fieldname,
                originalName:
                  vendorRegisterDto.vendor_main_image[0].originalname,
                encoding: vendorRegisterDto.vendor_main_image[0].encoding,
                mimeType: vendorRegisterDto.vendor_main_image[0].mimetype,
                destination: vendorRegisterDto.vendor_main_image[0].destination,
                fileName: vendorRegisterDto.vendor_main_image[0].filename,
                path: vendorRegisterDto.vendor_main_image[0].path,
                size: vendorRegisterDto.vendor_main_image[0].size,
              },
              {
                type: 'detail',
                fieldName: vendorRegisterDto.vendor_detail_image[0].fieldname,
                originalName:
                  vendorRegisterDto.vendor_detail_image[0].originalname,
                encoding: vendorRegisterDto.vendor_detail_image[0].encoding,
                mimeType: vendorRegisterDto.vendor_detail_image[0].mimetype,
                destination:
                  vendorRegisterDto.vendor_detail_image[0].destination,
                fileName: vendorRegisterDto.vendor_detail_image[0].filename,
                path: vendorRegisterDto.vendor_detail_image[0].path,
                size: vendorRegisterDto.vendor_detail_image[0].size,
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
      this.logger.error(error);
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
      this.logger.error(error);
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
      this.logger.error(error);
      throw new ServiceUnavailableException('update fail SeatColumnId');
    }
  }

  private async delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
