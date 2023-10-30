import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  async createMulterOptions() {
    const option = {
      fileFilter: (req, file, callback) => {
        callback(null, true);
      },

      storage: diskStorage({
        destination(req, file, callback) {
          const defaultDir = 'uploads';

          const fieldNameSplit = file.fieldname.split('_');

          const uploadDir = path.join(
            process.cwd(),
            defaultDir,
            fieldNameSplit[0],
            fieldNameSplit[1],
          );

          if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
          }

          callback(null, uploadDir);
        },

        filename(req, file, callback) {
          const ext = path.extname(file.originalname);

          callback(null, `${uuid()}${ext}`);
        },
      }),

      // limits: {
      //   fieldNameSize: 200,
      //   fields: 2,
      //   fileSize: 10 * 1024 * 1024,
      //   files: 10,
      // },
    };
    return option;
  }
}
