import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get<T = any>(key: string, defaultValue?: T): T {
    return this.configService.get<T>(key, defaultValue);
  }

  // Configuration getters for services
  get mongoUri(): string {
    return this.get<string>('MONGODB_URI', 'mongodb://localhost:27017/aladia');
  }

  get authServiceHost(): string {
    return this.get<string>('AUTH_SERVICE_HOST', 'localhost');
  }

  get authServicePort(): number {
    return parseInt(this.get<string>('AUTH_SERVICE_PORT', '3001'));
  }

  get gatewayPort(): number {
    return parseInt(this.get<string>('GATEWAY_PORT', '3000'));
  }
} 