import { Controller, Get, Logger, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { BatchesService } from './batches.service';

@Controller('batches')
export class BatchesController {
  private readonly logger = new Logger(BatchesController.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly bathesService: BatchesService,
  ) {}

  // @Get()
  // test() {
  //   this.bathesService.test();
  // }

  @Post('add')
  addJob() {
    this.bathesService.addJob('testJob', '*/5 * * * *');
  }

  @Post('stop')
  stopJob() {
    this.bathesService.stopJob('testJob');
  }

  @Get('jobs')
  jobs() {
    this.bathesService.getJobs();
  }
}
