import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudflareService } from './cloudflare.service';
import { StreamController } from './cloudflare.controller';
import { LiveStream } from '../entities/live-stream.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LiveStream]), AuthModule],
  controllers: [StreamController],
  providers: [CloudflareService],
  exports: [CloudflareService],
})
export class CloudflareModule {}