import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@app/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/core/user/schemas/user.schema';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.mongoUri,
        connectionFactory: (connection) => {
          connection.on('error', (err) => {
            Logger.error(`MongoDB connection error: ${err.message}`, 'MongooseModule');
          });
          connection.on('disconnected', () => {
            Logger.warn('MongoDB disconnected', 'MongooseModule');
          });
          connection.on('connected', () => {
            Logger.log('MongoDB connected', 'MongooseModule');
          });
          return connection;
        },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthenticationController, HealthController],
  providers: [AuthenticationService],
})
export class AuthenticationModule implements OnModuleInit {
  private readonly logger = new Logger(AuthenticationModule.name);

  onModuleInit() {
    this.logger.log('Authentication module initialized');
  }
} 