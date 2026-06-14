import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CloudflareService } from './cloudflare.service';
import { StreamController } from './cloudflare.controller';
import { LiveStream } from '../entities/live-stream.entity';
import { StreamChat } from '../stream/entities/stream-chat.entity';
import { StreamGateway } from '../stream/stream.gateway';

@Module({
  imports: [
    ConfigModule,
    // TypeOrmModule.forFeature([LiveStream, StreamChat]),
  ],
  controllers: [StreamController],
  providers: [CloudflareService, StreamGateway],
  exports: [CloudflareService],
})
export class CloudflareModule {}