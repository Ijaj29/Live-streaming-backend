import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LiveStream } from '../entities/live-stream.entity';
import { StreamChat } from '../stream/entities/stream-chat.entity';
import { User } from '../entities/user.entity';

export const createDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const port = parseInt(configService.get('DB_PORT', '3306'), 10);
  const host = configService.get('DB_HOST', '127.0.0.1');
  const username = configService.get('DB_USERNAME', 'root');
  const rawPassword = configService.get('DB_PASSWORD');
  const password = rawPassword === '' ? undefined : (rawPassword as string | undefined);
  const database = configService.get('DB_NAME', 'live_streaming');
  const sync = configService.get('NODE_ENV') === 'production' ? false : true;
  const logging = configService.get('DB_LOGGING') === 'true';

  if (configService.get('NODE_ENV', 'development') !== 'production') {
    console.log('Database config:', {
      host,
      port,
      username,
      password: password === undefined ? '(none)' : '(set)',
      database,
      synchronize: sync,
      logging,
    });
  }

  return {
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    entities: [LiveStream, StreamChat, User],
    synchronize: sync,
    logging,
  };
};
