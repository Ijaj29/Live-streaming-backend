import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LiveStream } from '../entities/live-stream.entity';
import { StreamChat } from '../stream/entities/stream-chat.entity';

let config: TypeOrmModuleOptions;

if (process.env.NODE_ENV === 'production') {
  config = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'live_streaming',
    entities: [LiveStream, StreamChat],
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
  };
} else {
  // Development: use SQLite for simplicity
  config = {
    type: 'better-sqlite3',
    database: 'live_streaming.db',
    entities: [LiveStream, StreamChat],
    synchronize: true,
    logging: process.env.DB_LOGGING === 'true',
  };
}

export const databaseConfig: TypeOrmModuleOptions = config;
