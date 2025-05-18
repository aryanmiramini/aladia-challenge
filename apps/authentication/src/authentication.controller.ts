import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '@app/core/user/dto/create-user.dto';
import { User } from '@app/core/user/schemas/user.schema';

@Controller()
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern('register_user')
  async register(@Payload() createUserDto: CreateUserDto) {
    this.logger.log(`Received registration request for user: ${createUserDto.email}`);
    return this.authenticationService.register(createUserDto);
  }

  @MessagePattern('get_all_users')
  async findAll() {
    this.logger.log('Received request to get all users');
    return this.authenticationService.findAll();
  }
  
  @Get('health')
  health() {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'authentication'
    };
  }
} 