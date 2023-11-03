import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Res,
} from '@nestjs/common';
import { PerformancesService } from './performances.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { PerformanceDto } from './dto/performance.dto';
import { RankDto } from './dto/rank.dto';

@Controller('performances')
@ApiTags('performances')
export class PerformancesController {
  private readonly logger = new Logger(PerformancesController.name);

  constructor(private readonly performancesService: PerformancesService) {}

  @Get()
  @ApiOperation({ summary: '모든 티켓 조회' })
  @ApiOkResponse({ type: PerformanceDto })
  async findAllPerformances(@Res() res: Response) {
    const performances = await this.performancesService.findAllPerformances();

    return res.status(HttpStatus.OK).json(performances);
  }

  @Get(':genre')
  @ApiOperation({ summary: '티켓의 장르 조회' })
  @ApiParam({
    name: 'genre',
    required: true,
    description: '장르명',
    example: 'concert',
  })
  @ApiOkResponse({
    type: PerformanceDto,
  })
  async findAllPerformancesByGenre(
    @Param('genre') genre: string,
    @Res() res: Response,
  ) {
    const performances =
      await this.performancesService.findAllPerformancesByGenre(genre);

    return res.status(HttpStatus.OK).json(performances);
  }

  @Get('ranks/ranks')
  @ApiOperation({ summary: '크롤링 된 티켓 조회 nestjs bug' })
  @ApiOkResponse({ type: RankDto })
  async findAllPerformanceRanks(@Res() res: Response) {
    const performances =
      await this.performancesService.findAllPerformanceRanks();

    return res.status(HttpStatus.OK).json(performances);
  }

  @Get('ranks/:distributor')
  @ApiOperation({ summary: '크롤링 된 티켓의 예매처 조회' })
  @ApiParam({
    name: 'distributor',
    required: true,
    description: '예매처명',
    example: 'interpark',
  })
  @ApiOkResponse({
    type: PerformanceDto,
  })
  async findAllPerformanceRanksByDistributor(
    @Param('distributor') distributor: string,
    @Res() res: Response,
  ) {
    this.logger.error('findAllPerformanceRanksByDistributor error');
    const performances =
      await this.performancesService.findAllPerformanceRanksByDistributor(
        distributor,
      );

    return res.status(HttpStatus.OK).json(performances);
  }

  @Get('ranks/:distributor/:genre')
  @ApiOperation({ summary: '크롤링 된 티켓의 예매처와 장르 조회' })
  @ApiParam({
    name: 'distributor',
    required: true,
    description: '예매처명',
    example: 'interpark',
  })
  @ApiParam({
    name: 'genre',
    required: true,
    description: '장르명',
    example: 'concert',
  })
  @ApiOkResponse({
    type: PerformanceDto,
  })
  async findAllPerformanceRanksByDistributorAndGenre(
    @Param('distributor') distributor: string,
    @Param('genre') genre: string,
    @Res() res: Response,
  ) {
    const performances =
      await this.performancesService.findAllPerformanceRanksByDistributorAndGenre(
        distributor,
        genre,
      );

    return res.status(HttpStatus.OK).json(performances);
  }

  @Get('ranks/:distributor/:genre/:type')
  @ApiOperation({
    summary: '크롤링 된 티켓의 예매처와 장르와 타입(힙합, 발라드 등) 조회',
  })
  @ApiParam({
    name: 'distributor',
    required: true,
    description: '예매처명',
    example: 'interpark',
  })
  @ApiParam({
    name: 'genre',
    required: true,
    description: '장르명',
    example: 'concert',
  })
  @ApiParam({
    name: 'type',
    required: true,
    description: '타입명',
    example: 'concert',
  })
  @ApiOkResponse({
    type: PerformanceDto,
  })
  async findAllPerformanceRanksByDistributorAndGenreAndType(
    @Param('distributor') distributor: string,
    @Param('genre') genre: string,
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    const performances =
      await this.performancesService.findAllPerformanceRanksByDistributorAndGenreAndType(
        distributor,
        genre,
        type,
      );

    return res.status(HttpStatus.OK).json(performances);
  }

  @Get('ranks/:genre')
  @ApiOperation({ summary: '크롤링 된 티켓의 장르 조회' })
  @ApiParam({
    name: 'genre',
    required: true,
    description: '장르명',
    example: 'concert',
  })
  @ApiOkResponse({ type: RankDto })
  async findAllPerformanceRanksByGenre(
    @Param('genre') genre: string,
    @Res() res: Response,
  ) {
    const performances =
      await this.performancesService.findAllPerformanceRanksByGenre(genre);

    return res.status(HttpStatus.OK).json(performances);
  }

  @Get('ranks/:genre/:type')
  @ApiOperation({
    summary: '크롤링 된 티켓의 장르와 타입(힙합, 발라드 등) 조회',
  })
  @ApiParam({
    name: 'genre',
    required: true,
    description: '장르명',
    example: 'concert',
  })
  @ApiParam({
    name: 'type',
    required: true,
    description: '타입명',
    example: 'concert',
  })
  @ApiOkResponse({ type: RankDto })
  async findAllPerformanceRanksByGenreAndType(
    @Param('genre') genre: string,
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    const performances =
      await this.performancesService.findAllPerformanceRanksByGenreAndType(
        genre,
        type,
      );

    return res.status(HttpStatus.OK).json(performances);
  }

  @Get('ranks/:type')
  @ApiOperation({ summary: '크롤링 된 티켓의 타입(힙합, 발라드 등) 조회' })
  @ApiParam({
    name: 'type',
    required: true,
    description: '타입명',
    example: 'concert',
  })
  @ApiOkResponse({ type: RankDto })
  async findAllPerformanceRanksByType(
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    const performances =
      await this.performancesService.findAllPerformanceRanksByType(type);

    return res.status(HttpStatus.OK).json(performances);
  }
}
