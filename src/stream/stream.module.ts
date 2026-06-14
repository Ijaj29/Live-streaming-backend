import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveStream } from '../entities/live-stream.entity';
import { StreamChat } from './entities/stream-chat.entity';
import { StreamGateway } from './stream.gateway';
import { StreamService } from './stream.service';

@Module({
  imports: [TypeOrmModule.forFeature([LiveStream, StreamChat])],
  providers: [StreamService, StreamGateway],
  exports: [StreamService],
})
export class StreamModule {}
