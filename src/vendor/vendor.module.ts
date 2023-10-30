import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/utils/multer.config';
import { PrismaService } from 'src/utils/prisma.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [VendorController],
  providers: [VendorService, PrismaService],
})
export class VendorModule {}
