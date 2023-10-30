import { Module } from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { PerformancesController } from './performances.controller';
import { PrismaService } from 'src/utils/prisma.service';

@Module({
  providers: [PerformancesService, PrismaService],
  controllers: [PerformancesController],
})
export class PerformancesModule {}
