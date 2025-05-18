import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  providers: [CoreService],
  exports: [CoreService, UserModule],
})
export class CoreModule {} 