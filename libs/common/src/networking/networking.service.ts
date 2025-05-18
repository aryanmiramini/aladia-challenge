import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport, ClientProxy, ClientOptions } from '@nestjs/microservices';

@Injectable()
export class NetworkingService {
  private authClient: ClientProxy;
  
  constructor() {
    const clientOptions: ClientOptions = {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.AUTH_SERVICE_PORT) || 3001,
      },
    };
    
    this.authClient = ClientProxyFactory.create(clientOptions);
  }

  getAuthClient(): ClientProxy {
    return this.authClient;
  }
} 