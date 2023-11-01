import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { PerformancesService } from './performances.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ResponsePerformanceDto } from './types/performance.dto';

@Controller('performances')
@ApiTags('performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  @Get()
  @ApiOperation({ summary: '모든 티켓' })
  @ApiOkResponse({ description: '모든 티켓', type: ResponsePerformanceDto })
  async findAllPerformances(@Res() res: Response) {
    const performances = await this.performancesService.findAllPerformances();

    return res.status(HttpStatus.OK).json(performances);
  }

  @Get(':genre')
  @ApiOperation({ summary: '장르에 따른 티켓' })
  @ApiOkResponse({
    description: '장르에 따른 티켓',
    type: ResponsePerformanceDto,
  })
  @ApiParam({
    name: 'genre',
    required: true,
    description: '장르명',
    example: 'concert',
  })
  async findAllPerformancesByGenre(
    @Param('genre') genre: string,
    @Res() res: Response,
  ) {
    const performances =
      await this.performancesService.findAllPerformancesByGenre(genre);

    return res.status(HttpStatus.OK).json(performances);
  }
}
