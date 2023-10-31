import { Controller, Logger, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batches')
export class BatchesController {
  private readonly logger = new Logger(BatchesController.name);

  constructor(private scheduler: SchedulerRegistry) {}

  @Post('start')
  start() {
    const job = this.scheduler.getCronJob('cronSample');

    job.start();

    this.logger.fatal(`cron start! - ${job.lastDate()}`);
  }

  @Post('stop')
  stop() {
    const job = this.scheduler.getCronJob('cronSample');

    job.stop();

    this.logger.fatal(`cron stop! - ${job.lastDate()}`);
  }
}
