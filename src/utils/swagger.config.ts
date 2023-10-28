import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const swaggerConfig = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('TicketPang API Docs')
    .setDescription('TicketPang API Docs')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('TicketPang-api-docs', app, document);
};

export default swaggerConfig;
