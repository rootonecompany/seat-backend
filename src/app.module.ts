import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';
import { PerformancesModule } from './performances/performances.module';

@Module({
  imports: [AuthenticationModule, UserModule, VendorModule, PerformancesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
