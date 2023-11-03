import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';
import { PerformancesModule } from './performances/performances.module';
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
    BatchesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
