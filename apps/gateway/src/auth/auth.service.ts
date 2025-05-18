import { Injectable, Logger, ServiceUnavailableException, InternalServerErrorException } from '@nestjs/common';
import { NetworkingService } from '@app/common/networking/networking.service';
import { CreateUserDto } from '@app/core/user/dto/create-user.dto';
import { firstValueFrom, timeout, catchError, of } from 'rxjs';
import { TimeoutError } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(private readonly networkingService: NetworkingService) {}

  async register(createUserDto: CreateUserDto) {
    try {
      try {
        await firstValueFrom(
          this.networkingService.getAuthClient()
            .send('health_check', {})
            .pipe(
              timeout(3000),
              catchError(err => {
                this.logger.error(`Health check failed: ${err.message}`);
                throw new ServiceUnavailableException('Authentication service is unavailable');
              })
            )
        );
      } catch (error) {
        this.logger.error(`Authentication service health check failed: ${error.message}`);
        throw new ServiceUnavailableException('Authentication service is unavailable');
      }

      return await firstValueFrom(
        this.networkingService.getAuthClient()
          .send('register_user', createUserDto)
          .pipe(
            timeout(5000),
            catchError(err => {
              if (err instanceof TimeoutError) {
                this.logger.error('Registration request timed out');
                throw new ServiceUnavailableException('Service temporarily unavailable');
              }
              this.logger.error(`Registration error: ${JSON.stringify(err)}`);
              throw new InternalServerErrorException('Failed to register user');
            })
          )
      );
    } catch (error) {
      this.logger.error(`Failed to register user: ${error.message}`);
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async findAllUsers() {
    try {
      try {
        await firstValueFrom(
          this.networkingService.getAuthClient()
            .send('health_check', {})
            .pipe(
              timeout(3000),
              catchError(err => {
                this.logger.error(`Health check failed: ${err.message}`);
                throw new ServiceUnavailableException('Authentication service is unavailable');
              })
            )
        );
      } catch (error) {
        this.logger.error(`Authentication service health check failed: ${error.message}`);
        throw new ServiceUnavailableException('Authentication service is unavailable');
      }

      return await firstValueFrom(
        this.networkingService.getAuthClient()
          .send('get_all_users', {})
          .pipe(
            timeout(5000),
            catchError(err => {
              if (err instanceof TimeoutError) {
                this.logger.error('Get users request timed out');
                throw new ServiceUnavailableException('Service temporarily unavailable');
              }
              throw new InternalServerErrorException('Failed to retrieve users');
            })
          )
      );
    } catch (error) {
      this.logger.error(`Failed to get users: ${error.message}`);
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
} 