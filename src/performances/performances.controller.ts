import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  @Get()
  @ApiOperation({ summary: '모든 공연' })
  @ApiResponse({
    description: 'success',
    status: 200,
  })
  async getAllPerformances(@Res() res: Response) {
    const performances = await this.performancesService.findAllPerformances();

    return res.status(HttpStatus.OK).json(performances);
  }

  @Get(':genre')
  @ApiOperation({ summary: '장르' })
  @ApiResponse({
    description: 'success',
    status: 200,
  })
  @ApiParam({ name: 'genre', required: true, description: '장르명' })
  async getPerformancesByGenre(
    @Param('genre') genre: string,
    @Res() res: Response,
  ) {
    const performances =
      await this.performancesService.findAllPerformancesByGenre(genre);

    return res.status(HttpStatus.OK).json(performances);
  }
}
