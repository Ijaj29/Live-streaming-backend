import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LiveStream } from '../entities/live-stream.entity';
import { StreamChat } from '../stream/entities/stream-chat.entity';
import { User } from '../entities/user.entity';

const port = parseInt(process.env.DB_PORT ?? '3306', 10);
const host = process.env.DB_HOST ?? '127.0.0.1';
const username = process.env.DB_USERNAME ?? 'root';
// Treat an explicit empty string as no password (undefined) so mysql2 will attempt
// a passwordless connection instead of sending an empty string as a password.
const rawPassword = process.env.DB_PASSWORD;
const password = rawPassword === '' ? undefined : (rawPassword ?? undefined);

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host,
  port,
  username,
  password,
  database: process.env.DB_NAME ?? 'live_streaming',
  entities: [LiveStream, StreamChat, User],
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: process.env.DB_LOGGING === 'true',
};

export const databaseConfig: TypeOrmModuleOptions = config;
