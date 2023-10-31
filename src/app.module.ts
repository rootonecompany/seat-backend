import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';
import { PerformancesModule } from './performances/performances.module';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { BatchesModule } from './batches/batches.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    AuthenticationModule,
    UserModule,
    VendorModule,
    PerformancesModule,
    TaskModule,
    BatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
