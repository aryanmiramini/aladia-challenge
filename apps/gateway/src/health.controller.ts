/**
 * Health Check Controller
 */
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API health status' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'gateway',
    };
  }
} 