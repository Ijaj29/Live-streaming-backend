import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudflareService } from './cloudflare.service';
import { StreamController } from './cloudflare.controller';
import { LiveStream } from '../entities/live-stream.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LiveStream])],
  controllers: [StreamController],
  providers: [CloudflareService],
  exports: [CloudflareService],
})
export class CloudflareModule {}