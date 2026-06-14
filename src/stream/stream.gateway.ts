import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StreamChat } from './entities/stream-chat.entity';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
})
export class StreamGateway implements OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  // Track socket → { streamId, userId } for disconnect cleanup
  private socketMap = new Map<string, { streamId: number; userId: number }>();

  constructor(
    @InjectRepository(StreamChat)
    private chatRepo: Repository<StreamChat>,
  ) {}

  @SubscribeMessage('joinStream')
  async handleJoin(
    @MessageBody() data: { streamId: number; userId: number; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `stream-${data.streamId}`;
    client.join(room);
    this.socketMap.set(client.id, { streamId: data.streamId, userId: data.userId });

    // Broadcast updated viewer count
    const count = this.server.sockets.adapter.rooms.get(room)?.size ?? 0;
    this.server.to(room).emit('viewerCount', { count });

    // Send last 50 messages to new joiner
    const history = await this.chatRepo.find({
      where: { streamId: data.streamId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    client.emit('chatHistory', history.reverse());
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { streamId: number; userId: number; username: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data.message?.trim()) return;

    const chat = this.chatRepo.create({
      streamId: data.streamId,
      userId: data.userId,
      username: data.username,
      message: data.message.trim(),
    });
    const saved = await this.chatRepo.save(chat);

    this.server.to(`stream-${data.streamId}`).emit('newMessage', {
      id: saved.id,
      userId: saved.userId,
      username: saved.username,
      message: saved.message,
      createdAt: saved.createdAt,
    });
  }

  handleDisconnect(client: Socket) {
    const info = this.socketMap.get(client.id);
    if (info) {
      const room = `stream-${info.streamId}`;
      const count = this.server.sockets.adapter.rooms.get(room)?.size ?? 0;
      this.server.to(room).emit('viewerCount', { count });
      this.socketMap.delete(client.id);
    }
  }
}