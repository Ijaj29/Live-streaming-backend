import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LiveStream } from '../entities/live-stream.entity';
import { StreamChat } from '../stream/entities/stream-chat.entity';
import { User } from '../entities/user.entity';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD ?? 'password',
  database: process.env.DB_NAME || 'live_streaming',
  entities: [LiveStream, StreamChat, User],
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: process.env.DB_LOGGING === 'true',
};

export const databaseConfig: TypeOrmModuleOptions = config;
