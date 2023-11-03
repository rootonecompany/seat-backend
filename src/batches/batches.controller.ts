import { Controller, Get, Logger, Post } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('batches')
@Controller('batches')
export class BatchesController {
  private readonly logger = new Logger(BatchesController.name);

  constructor(private readonly bathesService: BatchesService) {}

  @Post('start-scraping')
  @ApiOperation({ summary: '티켓 크롤링 시작' })
  @ApiOkResponse()
  addScrapingJob() {
    this.bathesService.addScrapingJob('scrapingJob', '0 20 * * 1');
  }

  @Post('stop-scraping')
  @ApiOperation({ summary: '티켓 크롤링 정지' })
  @ApiOkResponse()
  stopScrapingJob() {
    this.bathesService.stopScrapingJob('scrapingJob');
  }

  @Get('jobs')
  @Post('stop-scraping')
  @ApiOperation({ summary: '스케줄링 이름 조회' })
  @ApiOkResponse()
  jobs() {
    this.bathesService.getJobs();
  }
}
