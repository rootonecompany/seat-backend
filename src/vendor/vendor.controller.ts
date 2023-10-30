import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { PerformanceRegisterDto } from './dto/register.dto';

@Controller('vendor')
@ApiTags('업체 API')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post('register')
  @ApiOperation({ summary: ' 등록' })
  @ApiCreatedResponse({ description: '등록 완료' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'vendor_main_image', maxCount: 1 },
      { name: 'vendor_detail_image', maxCount: 1 },
    ]),
  )
  async register(
    @UploadedFiles()
    files: {
      vendor_main_image: Express.Multer.File[];
      vendor_detail_image: Express.Multer.File[];
    },
    @Body() performanceRegisterDto: PerformanceRegisterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const newRegisterDto = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      rating: req.body.rating,
      runningTime: req.body.runningTime,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      startAts: JSON.parse(req.body.startAts),
      places: JSON.parse(req.body.places),
      seatRanks: JSON.parse(req.body.seatRanks),
      floors: JSON.parse(req.body.floors),
      sections: JSON.parse(req.body.sections),
      columns: JSON.parse(req.body.columns),
    };
    const register = await this.vendorService.register(files, newRegisterDto);
    return res.status(HttpStatus.CREATED).json(register);
  }
}
