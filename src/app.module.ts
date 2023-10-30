import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [AuthenticationModule, UserModule, VendorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
