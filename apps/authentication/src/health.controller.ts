import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class HealthController {
  @MessagePattern('health_check')
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'authentication',
    };
  }
} 