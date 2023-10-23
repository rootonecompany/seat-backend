import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes: 모든 요청에 대해 파이프를 사용하도록 설정
  app.useGlobalPipes(
    // ValidationPipe: 데이터 유효 검증
    new ValidationPipe({
      whitelist: true, // 유효하지 않는 속성을 자동 제거 (decorator가 없는 속성값은 제거)
      forbidNonWhitelisted: true, // whitelist: true이고 걸러진 속성이 있다면 요청을 막음 (400 error)
      transform: true, // 문자열 숫자 => 숫자 자동 변환
    }),
  );

  setupSwagger(app);

  await app.listen(8000);
}
bootstrap();
