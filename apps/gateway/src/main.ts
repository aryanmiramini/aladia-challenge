import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@app/config';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  
  // Setup validation
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true 
  }));
  
  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Aladia API Gateway')
    .setDescription('Aladia NestJS Challenge API Documentation')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Get port from config (default to 3000)
  const configService = app.get(ConfigService);
  const port = configService.gatewayPort;
  
  await app.listen(port);
  console.log(`Gateway application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}
bootstrap(); 