import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(helmet());

  app.setGlobalPrefix('/api/v1/');
  app.enableCors({
    credentials: true,
    origin: [configService.get('FRONTEND_DOMAIN')],
  });

  // Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ecommerce')
    .setDescription('Best ecommerce')
    .addTag('ecommerce')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app
    .listen(configService.get<number>('PORT'))
    .then(() =>
      console.log(`App running on http://localhost:${configService.get<number>('PORT')}`),
    );
}
bootstrap();
