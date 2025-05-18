import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/config';
import { CommonModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class GatewayModule {} 