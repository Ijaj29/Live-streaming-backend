import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiveStream } from '../entities/live-stream.entity';
import { StreamChat } from './entities/stream-chat.entity';

@Injectable()
export class StreamService {
  constructor(
    @InjectRepository(LiveStream)
    private liveStreamRepository: Repository<LiveStream>,
    @InjectRepository(StreamChat)
    private streamChatRepository: Repository<StreamChat>,
  ) {}

  // LiveStream methods
  async createLiveStream(data: Partial<LiveStream>): Promise<LiveStream> {
    const stream = this.liveStreamRepository.create(data);
    return this.liveStreamRepository.save(stream);
  }

  async getLiveStreamById(id: number): Promise<LiveStream | null> {
    return this.liveStreamRepository.findOne({ where: { id } });
  }

  async getLiveStreamByKey(cfStreamKey: string): Promise<LiveStream | null> {
    return this.liveStreamRepository.findOne({ where: { cfStreamKey } });
  }

  async updateLiveStream(id: number, data: Partial<LiveStream>): Promise<LiveStream | null> {
    await this.liveStreamRepository.update(id, data);
    return this.getLiveStreamById(id);
  }

  async deleteLiveStream(id: number): Promise<boolean> {
    const result = await this.liveStreamRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getAllLiveStreams(): Promise<LiveStream[]> {
    return this.liveStreamRepository.find();
  }

  async getLiveStreamsByUser(userId: number): Promise<LiveStream[]> {
    return this.liveStreamRepository.find({ where: { createdBy: userId } });
  }

  // StreamChat methods
  async createChatMessage(data: Partial<StreamChat>): Promise<StreamChat> {
    const chat = this.streamChatRepository.create(data);
    return this.streamChatRepository.save(chat);
  }

  async getChatHistory(streamId: number, limit: number = 50): Promise<StreamChat[]> {
    return this.streamChatRepository.find({
      where: { streamId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async deleteChatsByStream(streamId: number): Promise<boolean> {
    const result = await this.streamChatRepository.delete({ streamId });
    return (result.affected ?? 0) > 0;
  }
}
