import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Validate MongoDB connection string
  const mongodbUri = configService.get<string>('MONGODB_URI');
  if (!mongodbUri) {
    console.warn(
      'Warning: MONGODB_URI environment variable is not set. Using default local MongoDB.',
    );
  }

  // Get port from environment variable or use default
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📦 MongoDB URI: ${mongodbUri || 'Using default local MongoDB'}`);
}

bootstrap().catch((error: Error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
