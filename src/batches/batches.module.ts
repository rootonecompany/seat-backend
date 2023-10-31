import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { PrismaService } from 'src/utils/prisma.service';
import { BatchesController } from './batches.controller';

@Module({
  imports: [],
  providers: [BatchesService, PrismaService],
  controllers: [BatchesController],
})
export class BatchesModule {}
