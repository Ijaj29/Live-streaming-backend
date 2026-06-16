import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { StreamModule } from './stream/stream.module';
import { AuthModule } from './auth/auth.module';
import { createDatabaseConfig } from './config/database.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createDatabaseConfig,
    }),
    AuthModule,
    CloudflareModule,
    StreamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
