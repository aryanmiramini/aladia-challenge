import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { NetworkingModule } from './networking/networking.module';

@Module({
  imports: [NetworkingModule],
  providers: [CommonService],
  exports: [CommonService, NetworkingModule],
})
export class CommonModule {} 